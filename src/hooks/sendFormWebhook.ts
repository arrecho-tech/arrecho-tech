import type { AfterChangeHook } from 'payload'

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

export const sendFormWebhook: AfterChangeHook<FormSubmissionDoc> = async ({ doc, req }) => {
  try {
    const payload = req.payload
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

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(endpoint?.secret ? { 'x-webhook-secret': String(endpoint.secret) } : {}),
      },
      body: JSON.stringify({
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
      }),
    })

    if (!res.ok) {
      payload.logger.warn(
        {
          status: res.status,
          statusText: res.statusText,
          url,
        },
        'Form webhook returned non-2xx',
      )
    }
  } catch (err) {
    // Best-effort: never block a form submission because a webhook failed.
    req.payload?.logger?.error({ err }, 'Failed to send form webhook')
  }

  return doc
}
