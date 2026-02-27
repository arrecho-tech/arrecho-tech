import { test, expect } from '@playwright/test'

test.describe('Matrix .well-known', () => {
  test('serves /.well-known/matrix/client', async ({ request }) => {
    const res = await request.get('http://localhost:3000/.well-known/matrix/client')
    expect(res.ok()).toBeTruthy()
    expect(res.headers()['content-type']).toContain('application/json')

    const json = await res.json()
    expect(json).toMatchObject({
      'm.homeserver': {
        base_url: 'https://matrix.arrecho.tech',
      },
    })
  })

  test('serves /.well-known/matrix/server', async ({ request }) => {
    const res = await request.get('http://localhost:3000/.well-known/matrix/server')
    expect(res.ok()).toBeTruthy()
    expect(res.headers()['content-type']).toContain('application/json')

    const json = await res.json()
    expect(json).toMatchObject({
      'm.server': 'matrix.arrecho.tech:443',
    })
  })
})
