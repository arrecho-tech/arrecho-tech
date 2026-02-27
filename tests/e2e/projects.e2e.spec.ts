import { expect, test } from '@playwright/test'

import { cleanupTestProject, seedTestProject, testProject } from '../helpers/seedProject'

test.describe('Projects', () => {
  test.beforeAll(async () => {
    await seedTestProject()
  })

  test.afterAll(async () => {
    await cleanupTestProject()
  })

  test('renders published project page', async ({ page }) => {
    await page.goto(`http://localhost:3000/projects/${testProject.slug}`)

    await expect(page.locator('h1').first()).toHaveText(testProject.title)
    await expect(page.getByText('Hello from project content block')).toBeVisible()
  })
})
