import { expect, test } from '@playwright/test'

import {
  cleanupSiteSettingsBackground,
  seedSiteSettingsWithBackground,
} from '../helpers/seedSiteSettings'

test.describe('Site background', () => {
  test.beforeAll(async () => {
    await seedSiteSettingsWithBackground()
  })

  test.afterAll(async () => {
    await cleanupSiteSettingsBackground()
  })

  test('applies a site-wide background image from global settings', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const backgroundImage = page.getByTestId('site-background-image')

    await expect(backgroundImage).toHaveAttribute('data-has-image', 'true')

    await expect
      .poll(async () => {
        return backgroundImage.evaluate((node) => {
          return window.getComputedStyle(node).backgroundImage
        })
      })
      .not.toBe('none')

    // icon/parallax intentionally not asserted (background-only mode)

  })
})
