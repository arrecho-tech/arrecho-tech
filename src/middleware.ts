import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!_next|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)'],
}

export default function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const url = req.nextUrl

  // Route dashboard subdomain to /dashboard/* routes
  if (host.startsWith('dashboard.')) {
    // Prevent access to Payload admin from the dashboard host
    if (url.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', url))
    }

    if (!url.pathname.startsWith('/dashboard')) {
      const dashboardURL = url.clone()
      dashboardURL.pathname = `/dashboard${url.pathname}`
      return NextResponse.rewrite(dashboardURL)
    }
  }

  return NextResponse.next()
}
