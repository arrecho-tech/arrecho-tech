import { test, expect } from '@playwright/test'

import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Frontend (logged in)', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('shows welcome back with first name', async ({ page }) => {
    await login({ page, user: testUser })

    await page.goto('http://localhost:3000')

    const heading = page.locator('h1').first()
    await expect(heading).toHaveText(`Welcome back, ${testUser.firstName}`)
  })
})
