import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { findContactForm, sanitizeContactForm } from '@/utils/contactForm'

export async function GET() {
  const config = await configPromise
  const payload = await getPayload({ config })

  const form = await findContactForm(payload)

  if (!form) {
    return NextResponse.json({ form: null }, { status: 200 })
  }

  return NextResponse.json({ form: sanitizeContactForm(form) }, { status: 200 })
}
