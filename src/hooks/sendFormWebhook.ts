import { primarySiteSettingsSlug } from '../globals/SiteSettings'

type WebhookEndpoint = {
  category?: string
  url?: string
  secret?: string
  enabled?: boolean
}

type SubmissionDataRow = {
  field: string
  value: unknown
}

type FormSubmissionDoc = {
  id?: number | string
  createdAt?: string
  form?: number | string | { id?: number | string }
  submissionData?: SubmissionDataRow[]
}

type FormDoc = {
  id?: number | string
  title?: string
  webhookCategory?: string
  webhook_category?: string
}

type SiteSettingsDoc = {
  defaultFormWebhookCategory?: string
  formWebhooks?: WebhookEndpoint[]
}

function isDiscordWebhook(url: string): boolean {
  return (
    url.startsWith('https://discord.com/api/webhooks/') ||
    url.startsWith('https://discordapp.com/api/webhooks/')
  )
}

function toDiscordFieldValue(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  return s.slice(0, Math.max(0, max - 1)) + '…'
}

export const sendFormWebhook = async (args: unknown) => {
  const { doc, req } = args as { doc: FormSubmissionDoc; req: unknown }

  try {
    const payload = (req as { payload?: unknown })?.payload as {
      logger: {
        warn: (meta: unknown, message?: string) => void
      }
      findByID: (args: unknown) => Promise<unknown>
      findGlobal: (args: unknown) => Promise<unknown>
    } | undefined
    if (!payload) return doc

    const formRel = doc?.form
    const formID = typeof formRel === 'object' ? formRel?.id : formRel
    if (!formID) return doc

    const form = (await payload.findByID({
      collection: 'forms',
      id: formID,
      req,
    })) as FormDoc

    const category = form?.webhookCategory || form?.webhook_category

    const siteSettings = (await payload.findGlobal({
      slug: primarySiteSettingsSlug,
      req,
    })) as SiteSettingsDoc

    const endpoints = siteSettings?.formWebhooks ?? []
    const defaultCategory = siteSettings?.defaultFormWebhookCategory

    const targetCategory = category || defaultCategory
    if (!targetCategory) return doc

    const endpoint = endpoints.find((e) => e?.enabled !== false && e?.category === targetCategory)
    const url = endpoint?.url
    if (!url) return doc

    const submissionData = doc?.submissionData ?? []
    const submissionDataMap = Object.fromEntries(submissionData.map((r) => [r.field, r.value]))

    const headers: Record<string, string> = {
      'content-type': 'application/json',
      ...(endpoint?.secret ? { 'x-webhook-secret': String(endpoint.secret) } : {}),
    }

    const webhookURL = isDiscordWebhook(url) ? `${url}?wait=true` : url

    const basePayload = {
      event: 'form_submission.created',
      category: targetCategory,
      submission: {
        id: doc?.id,
        createdAt: doc?.createdAt,
        form: {
          id: form?.id,
          title: form?.title,
        },
        submissionData,
        submissionDataMap,
      },
    }

    const body = isDiscordWebhook(url)
      ? {
          // Discord requires one of: content, embeds, file, poll
          content: truncate(
            `New form submission (${targetCategory}) — ${form?.title ?? 'Form'}`,
            2000,
          ),
          allowed_mentions: { parse: [] },
          embeds: [
            {
              title: form?.title ? `Form: ${form.title}` : 'New Form Submission',
              description: `Category: **${targetCategory}**`,
              color: 0x262626,
              fields: Object.entries(submissionDataMap)
                .filter(([k]) => typeof k === 'string' && k.length > 0)
                .slice(0, 25)
                .map(([k, v]) => ({
                  name: truncate(k, 256),
                  value: truncate(toDiscordFieldValue(v) || '—', 1024),
                  inline: false,
                })),
              timestamp: doc?.createdAt,
            },
          ],
        }
      : basePayload

    const res = await fetch(webhookURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      payload.logger.warn(
        {
          status: res.status,
          statusText: res.statusText,
          url: webhookURL,
          response: truncate(text, 2000),
        },
        'Form webhook returned non-2xx',
      )
    }
  } catch (err) {
    // Best-effort: never block a form submission because a webhook failed.
    ;(req as { payload?: { logger?: { error?: (meta: unknown, message?: string) => void } } })?.payload?.logger?.error?.(
      { err },
      'Failed to send form webhook',
    )
  }

  return doc
}
