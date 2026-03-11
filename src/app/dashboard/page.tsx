import { headers } from 'next/headers'
import Link from 'next/link'

type MeResponse = {
  user?: {
    id: string | number
    email?: string
    firstName?: string
    lastName?: string
    role?: string
  } | null
}

async function getMe(): Promise<MeResponse> {
  const h = await headers()
  const host = h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'https'
  const origin = host ? `${proto}://${host}` : ''

  const res = await fetch(`${origin}/api/users/me`, {
    cache: 'no-store',
    headers: {
      cookie: h.get('cookie') ?? '',
    },
  })

  if (!res.ok) return {}
  return (await res.json()) as MeResponse
}

export default async function DashboardHomePage() {
  const me = await getMe()

  if (!me.user) {
    return (
      <div style={{ maxWidth: 720, margin: '120px auto', padding: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Welcome</h1>
        <p style={{ marginTop: 8 }}>Please sign in to access your dashboard.</p>
        <p style={{ marginTop: 16 }}>
          <Link href="/login">Go to login</Link>
        </p>
      </div>
    )
  }

  const displayName = [me.user.firstName, me.user.lastName].filter(Boolean).join(' ') || me.user.email

  return (
    <div style={{ maxWidth: 720, margin: '120px auto', padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Welcome to your dashboard</h1>
      <p style={{ marginTop: 8 }}>Hi {displayName}.</p>
    </div>
  )
}
