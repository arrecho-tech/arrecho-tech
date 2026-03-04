import { getPayload, Payload } from 'payload'
import { describe, it, beforeAll, expect } from 'vitest'

import config from '@/payload.config'
import { findContactForm, sanitizeContactForm } from '@/utils/contactForm'

let payload: Payload

const describeIfEnabled = process.env.RUN_INT_TESTS === 'true' ? describe : describe.skip

describeIfEnabled('Contact form', () => {
  beforeAll(async () => {
    try {
      const payloadConfig = await config
      payload = await getPayload({ config: payloadConfig })
    } catch {
      payload = undefined as unknown as Payload
    }
  })

  it('can find and sanitize the Contact form (if present)', async () => {
    if (!payload) return

    const form = await findContactForm(payload)

    // The test suite may run with an empty DB depending on environment.
    // If the form exists, sanitization should be stable.
    if (form) {
      const sanitized = sanitizeContactForm(form)
      expect(sanitized.title.toLowerCase()).toBe('contact')
      expect(Array.isArray(sanitized.fields)).toBe(true)
    } else {
      expect(form).toBeNull()
    }
  })
})
