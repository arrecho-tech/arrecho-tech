import type { Metadata } from 'next'
import React from 'react'
import { Analytics } from '@vercel/analytics/react'
import { getPayload } from 'payload'

import { SiteBackground } from '@/components/frontend/SiteBackground'
import { siteSettingsSlugs } from '@/globals/SiteSettings'
import config from '@/payload.config'
import type { SiteSetting } from '@/payload-types'

import './styles.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Arrecho Tech',
    template: '%s | Arrecho Tech',
  },
  description: 'Arrecho Tech website.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Arrecho Tech',
    description: 'Arrecho Tech website.',
    images: ['/brand/logo-square.svg'],
  },
}

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings()

  const backgroundImageURLs = Array.from(
    new Set(
      (siteSettings?.backgroundImages ?? []).flatMap((image) => {
        if (typeof image !== 'object' || image === null) {
          return []
        }

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
        <Analytics />
      </body>
    </html>
  )
}
