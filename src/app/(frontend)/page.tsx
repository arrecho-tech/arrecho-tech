import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="home">
      <div className="content">
        <picture>
          <source srcSet="/brand/logo-circle.svg" />
          <Image
            alt="Arrecho Tech"
            height={65}
            src="/brand/logo-circle.svg"
            width={65}
          />
        </picture>
        {!user && <h1>Welcome to Arrecho Tech.</h1>}
        {user && <h1>Welcome back, {user.email}</h1>}
      </div>
    </div>
  )
}
