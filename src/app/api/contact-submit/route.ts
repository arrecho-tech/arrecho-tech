import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import {
  allowedFieldNamesFromForm,
  findContactForm,
  sanitizeContactForm,
  type SanitizedContactForm,
} from '@/utils/contactForm'

type SubmissionDataRow = { field: string; value: unknown }

type Body = {
  submissionData?: SubmissionDataRow[]
  submissionDataMap?: Record<string, unknown>
}

function toRows(body: Body, allowed: Set<string>): SubmissionDataRow[] {
  if (Array.isArray(body.submissionData)) {
    return body.submissionData
      .filter((r) => r && typeof r.field === 'string' && allowed.has(r.field))
      .map((r) => ({ field: r.field, value: r.value }))
  }

  if (body.submissionDataMap && typeof body.submissionDataMap === 'object') {
    return Object.entries(body.submissionDataMap)
      .filter(([k]) => allowed.has(k))
      .map(([field, value]) => ({ field, value }))
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

  const submission = await payload.create({
    collection: 'form-submissions',
    overrideAccess: true,
    data: {
      form: form.id,
      submissionData,
    },
  })

  return NextResponse.json({ ok: true, id: submission.id }, { status: 200 })
}
