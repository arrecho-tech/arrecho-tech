import React from 'react'
import { getPayload } from 'payload'

import { SiteBackground } from '@/components/frontend/SiteBackground'
import { siteSettingsSlugs } from '@/globals/SiteSettings'
import config from '@/payload.config'
import type { SiteSetting } from '@/payload-types'

export const dynamic = 'force-dynamic'

async function getSiteSettings(): Promise<SiteSetting | null> {
  const payload = await getPayload({ config: await config })

  for (const slug of siteSettingsSlugs) {
    try {
      return (await payload.findGlobal({
        slug: slug as never,
        depth: 1,
      })) as SiteSetting
    } catch (error) {
      const message = error instanceof Error ? error.message : ''

      if (
        message.includes('Global not found') ||
        message.includes('global with slug') ||
        message.includes('not configured')
      ) {
        continue
      }

      throw error
    }
  }

  return null
}

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings()

  const backgroundImageURLs = Array.from(
    new Set(
      (siteSettings?.backgroundImages ?? []).flatMap((image) => {
        if (typeof image !== 'object' || image === null) return []
        return image.url ? [image.url] : []
      }),
    ),
  )

  return (
    <html lang="en">
      <body>
        <SiteBackground
          imageURLs={backgroundImageURLs}
          overlayEnabled={siteSettings?.overlayEnabled}
          overlayOpacity={siteSettings?.overlayOpacity}
          parallaxEnabled={siteSettings?.parallaxEnabled}
          parallaxIntensity={siteSettings?.parallaxIntensity}
        />

        <main className="frontend-main">{children}</main>
      </body>
    </html>
  )
}
