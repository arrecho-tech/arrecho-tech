import { headers } from 'next/headers'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

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
      <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          Please sign in to access your dashboard.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/dashboard/login">Sign in</Link>
          </Button>
        </div>
      </div>
    )
  }

  const displayName = [me.user.firstName, me.user.lastName].filter(Boolean).join(' ') || me.user.email

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Welcome to your dashboard</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">Hi {displayName}.</p>
    </div>
  )
}
