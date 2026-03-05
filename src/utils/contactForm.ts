import type { Payload } from 'payload'

export type ContactFormFieldBlock = {
  id?: string
  blockType:
    | 'text'
    | 'textarea'
    | 'email'
    | 'number'
    | 'checkbox'
    | 'select'
    | 'radio'
    | 'message'
  name?: string
  label?: unknown
  required?: boolean
  placeholder?: string
  defaultValue?: unknown
  options?: Array<{ label?: unknown; value?: string }>
  // For blockType === 'message'
  message?: unknown
}

export type SanitizedContactForm = {
  id: number | string
  title: string
  fields: ContactFormFieldBlock[]
}

type RawFormDoc = {
  id: number | string
  title?: string
  fields?: unknown
}

type RawBlock = {
  id?: string
  blockType?: string
  name?: string
  label?: unknown
  required?: unknown
  placeholder?: string
  defaultValue?: unknown
  options?: unknown
  message?: unknown
}

export async function findContactForm(payload: Payload): Promise<RawFormDoc | null> {
  // Keep forms private at the access-control layer. Server-side code can still
  // fetch the form via overrideAccess.
  const result = await payload.find({
    collection: 'forms',
    limit: 50,
    overrideAccess: true,
  })

  const docs = (result?.docs ?? []) as RawFormDoc[]

  const doc = docs.find((d) => String(d?.title ?? '').trim().toLowerCase() === 'contact')
  return doc ?? null
}

export function sanitizeContactForm(form: RawFormDoc): SanitizedContactForm {
  const rawBlocks = Array.isArray(form?.fields) ? (form.fields as RawBlock[]) : []

  const fields: ContactFormFieldBlock[] = rawBlocks
    .filter((b): b is RawBlock => Boolean(b && typeof b === 'object'))
    .map((b) => ({
      id: b.id,
      blockType: b.blockType as ContactFormFieldBlock['blockType'],
      name: b.name,
      label: b.label,
      required: Boolean(b.required),
      placeholder: b.placeholder,
      defaultValue: b.defaultValue,
      options: Array.isArray(b.options)
        ? (b.options as Array<{ label?: unknown; value?: string }>).map((o) => ({
            label: o.label,
            value: o.value,
          }))
        : undefined,
      message: b.message,
    }))
    .filter((b) =>
      [
        'text',
        'textarea',
        'email',
        'number',
        'checkbox',
        'select',
        'radio',
        'message',
      ].includes(b.blockType),
    )

  return {
    id: form.id,
    title: String(form.title ?? ''),
    fields,
  }
}

export function allowedFieldNamesFromForm(form: SanitizedContactForm): Set<string> {
  return new Set(
    form.fields
      .map((f) => f?.name)
      .filter((n): n is string => typeof n === 'string' && n.length > 0),
  )
}
