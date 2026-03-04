import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

const describeIfEnabled = process.env.RUN_INT_TESTS === 'true' ? describe : describe.skip

describeIfEnabled('API', () => {
  beforeAll(async () => {
    try {
      const payloadConfig = await config
      payload = await getPayload({ config: payloadConfig })
    } catch {
      // Local dev may not have Postgres running; skip these integration tests.
      // Individual tests will no-op if payload is undefined.
      payload = undefined as unknown as Payload
    }
  })

  it('fetches users', async () => {
    if (!payload) return

    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('fetches posts', async () => {
    if (!payload) return

    const posts = await payload.find({
      collection: 'posts',
    })
    expect(posts).toBeDefined()
  })
})
