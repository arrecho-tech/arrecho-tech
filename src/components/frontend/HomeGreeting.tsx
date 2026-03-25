'use client'

import React, { useEffect, useState } from 'react'

type MeResponse = {
  user?: {
    firstName?: string | null
  } | null
}

export function HomeGreeting() {
  const [name, setName] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const res = await fetch('/api/users/me', {
          credentials: 'include',
          headers: { accept: 'application/json' },
        })
        if (!res.ok) {
          setReady(true)
          return
        }

        const json = (await res.json()) as MeResponse
        const firstName = json?.user?.firstName
        if (!cancelled && firstName) setName(firstName)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) return <h1>Welcome to Arrecho Tech.</h1>
  if (!name) return <h1>Welcome to Arrecho Tech.</h1>
  return <h1>Welcome back, {name}</h1>
}
