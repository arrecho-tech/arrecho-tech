import { getPayload } from 'payload'

import config from '../../src/payload.config.js'

const SITE_SETTINGS_SLUG = 'siteSettings' as const
const TEST_MEDIA_ALT_PREFIX = '[e2e] site-settings-bg'

let seededMediaIDs: number[] = []

export async function seedSiteSettingsWithBackground(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'media',
    where: {
      alt: {
        like: `${TEST_MEDIA_ALT_PREFIX}%`,
      },
    },
  })

  const firstMedia = await payload.create({
    collection: 'media',
    data: {
      alt: `${TEST_MEDIA_ALT_PREFIX} 1`,
      url: '/brand/logo-circle.svg',
      mimeType: 'image/svg+xml',
    },
  })

  const secondMedia = await payload.create({
    collection: 'media',
    data: {
      alt: `${TEST_MEDIA_ALT_PREFIX} 2`,
      url: '/brand/logo-square.svg',
      mimeType: 'image/svg+xml',
    },
  })

  seededMediaIDs = [firstMedia.id, secondMedia.id]

  await payload.updateGlobal({
    slug: SITE_SETTINGS_SLUG,
    data: {
      backgroundImages: seededMediaIDs,
      overlayEnabled: true,
      overlayOpacity: 0.4,
      parallaxEnabled: true,
      parallaxIntensity: 14,
    },
  })
}

export async function cleanupSiteSettingsBackground(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: SITE_SETTINGS_SLUG,
    data: {
      backgroundImages: [],
      overlayEnabled: true,
      overlayOpacity: 0.45,
      parallaxEnabled: true,
      parallaxIntensity: 16,
    },
  })

  if (seededMediaIDs.length) {
    await payload.delete({
      collection: 'media',
      where: {
        id: {
          in: seededMediaIDs,
        },
      },
    })

    seededMediaIDs = []
    return
  }

  await payload.delete({
    collection: 'media',
    where: {
      alt: {
        like: `${TEST_MEDIA_ALT_PREFIX}%`,
      },
    },
  })
}
