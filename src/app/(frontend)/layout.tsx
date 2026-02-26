import type { Metadata } from 'next'
import React from 'react'
import { Analytics } from '@vercel/analytics/react'

import './styles.css'

export const metadata: Metadata = {
  title: {
    default: 'Arrecho Tech',
    template: '%s | Arrecho Tech',
  },
  description: 'Arrecho Tech website.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Arrecho Tech',
    description: 'Arrecho Tech website.',
    images: ['/brand/logo-square.svg'],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
