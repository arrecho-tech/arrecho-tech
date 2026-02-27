import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Branding may change, but site should include our name
    await expect(page).toHaveTitle(/Arrecho Tech/)

    const heading = page.locator('h1').first()

    // When not logged in, homepage welcomes visitors
    await expect(heading).toHaveText(/Welcome to Arrecho Tech\./)
  })
})
