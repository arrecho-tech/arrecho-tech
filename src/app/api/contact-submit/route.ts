import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import {
  allowedFieldNamesFromForm,
  findContactForm,
  sanitizeContactForm,
  type SanitizedContactForm,
} from '@/utils/contactForm'

type SubmissionDataRow = { field: string; value: string }

type Body = {
  submissionData?: Array<{ field: string; value: unknown }>
  submissionDataMap?: Record<string, unknown>
}

function toStringValue(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value == null) return ''
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function toRows(body: Body, allowed: Set<string>): SubmissionDataRow[] {
  if (Array.isArray(body.submissionData)) {
    return body.submissionData
      .filter((r) => r && typeof r.field === 'string' && allowed.has(r.field))
      .map((r) => ({ field: r.field, value: toStringValue(r.value) }))
      .filter((r) => r.value.length > 0)
  }

  if (body.submissionDataMap && typeof body.submissionDataMap === 'object') {
    return Object.entries(body.submissionDataMap)
      .filter(([k]) => allowed.has(k))
      .map(([field, value]) => ({ field, value: toStringValue(value) }))
      .filter((r) => r.value.length > 0)
  }

  return []
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body

  const config = await configPromise
  const payload = await getPayload({ config })

  const rawForm = await findContactForm(payload)
  if (!rawForm) {
    return NextResponse.json({ ok: false, error: 'contact_form_not_found' }, { status: 404 })
  }

  const form: SanitizedContactForm = sanitizeContactForm(rawForm)
  const allowed = allowedFieldNamesFromForm(form)

  const submissionData = toRows(body, allowed)
  if (submissionData.length === 0) {
    return NextResponse.json({ ok: false, error: 'empty_submission' }, { status: 400 })
  }

  const formID = typeof form.id === 'number' ? form.id : Number(form.id)
  if (!Number.isFinite(formID)) {
    return NextResponse.json({ ok: false, error: 'invalid_form_id' }, { status: 500 })
  }

  const submission = await payload.create({
    collection: 'form-submissions',
    overrideAccess: true,
    data: {
      form: formID,
      submissionData,
    },
  })

  return NextResponse.json({ ok: true, id: submission.id }, { status: 200 })
}
