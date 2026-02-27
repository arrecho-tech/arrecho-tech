import fs from 'fs'
import path from 'path'

import { getPayload } from 'payload'

import config from '../../src/payload.config.js'

const SITE_SETTINGS_SLUG = 'siteSettings' as const
const TEST_MEDIA_ALT_PREFIX = '[e2e] site-settings-bg'

let seededMediaIDs: number[] = []

function fixturePath(name: string) {
  return path.resolve(process.cwd(), 'tests', 'fixtures', name)
}

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

  const firstPath = fixturePath('bg1.png')
  const secondPath = fixturePath('bg2.png')

  const firstMedia = await payload.create({
    collection: 'media',
    data: {
      alt: `${TEST_MEDIA_ALT_PREFIX} 1`,
    },
    file: {
      data: fs.readFileSync(firstPath),
      mimetype: 'image/png',
      name: 'bg1.png',
      size: fs.statSync(firstPath).size,
    },
  })

  const secondMedia = await payload.create({
    collection: 'media',
    data: {
      alt: `${TEST_MEDIA_ALT_PREFIX} 2`,
    },
    file: {
      data: fs.readFileSync(secondPath),
      mimetype: 'image/png',
      name: 'bg2.png',
      size: fs.statSync(secondPath).size,
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
