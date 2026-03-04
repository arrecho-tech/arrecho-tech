import { test, expect } from '@playwright/test'

import { cleanupContactForm, seedContactForm } from '../helpers/seedContactForm'

test.describe('Homepage contact form', () => {
  test.beforeAll(async () => {
    await seedContactForm()
  })

  test.afterAll(async () => {
    await cleanupContactForm()
  })

  test('renders contact form and can submit', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const form = page.getByLabel('contact-form')
    await expect(form).toBeVisible()

    await page.getByRole('textbox', { name: 'Name' }).fill('Diego')
    await page.getByRole('textbox', { name: 'Email' }).fill('diego@example.com')
    await page.getByRole('textbox', { name: 'Message' }).fill('Hello from e2e')

    await page.getByRole('button', { name: 'Send' }).click()

    await expect(page.getByLabel('contact-received')).toBeVisible()
  })
})
