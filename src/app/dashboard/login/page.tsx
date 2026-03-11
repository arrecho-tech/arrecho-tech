'use client'

import React, { useState } from 'react'

export default function DashboardLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Login failed')
      }

      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '120px auto', padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Dashboard login</h1>

      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ marginBottom: 6 }}>Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            style={{ width: '100%', padding: 10 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ marginBottom: 6 }}>Password</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            style={{ width: '100%', padding: 10 }}
          />
        </label>

        {error ? (
          <div style={{ color: 'crimson', marginBottom: 12, whiteSpace: 'pre-wrap' }}>{error}</div>
        ) : null}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
