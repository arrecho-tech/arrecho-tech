import { test, expect, Page } from '@playwright/test'

import { cleanupTestPost, seedTestPost, testPost } from '../helpers/seedPost'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestPost()

    const context = await browser.newContext()
    page = await context.newPage()
  })

  test.afterAll(async () => {
    await cleanupTestPost()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Branding may change, but site should include our name
    await expect(page).toHaveTitle(/Arrecho Tech/)

    const heading = page.locator('h1').first()

    // When not logged in, homepage welcomes visitors
    await expect(heading).toHaveText(/Welcome to Arrecho Tech\./)
  })

  test('renders a post with layout blocks', async () => {
    await page.goto(`http://localhost:3000/posts/${testPost.slug}`)

    await expect(page.locator('h1')).toHaveText(testPost.title)
    await expect(page.locator('text=Grid card rendered from block data')).toBeVisible()
    await expect(page.locator('code')).toContainText('const hello = "from code block"')
    await expect(page.locator('blockquote')).toContainText(
      'The details are not the details. They make the design.',
    )
  })
})
