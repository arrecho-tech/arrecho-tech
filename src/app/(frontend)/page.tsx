import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import Link from 'next/link'
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
          <Image alt="Arrecho Tech" height={130} src="/brand/logo-circle.svg" width={130} />
        </picture>
        {!user && <h1>Welcome to Arrecho Tech.</h1>}
        {user && <h1>Welcome back, {user.firstName}</h1>}

        <div className="links">
          <a className="admin" href={payloadConfig.routes.admin} rel="noopener noreferrer" target="_blank">
            Admin
          </a>
          <Link className="docs" href="/posts">
            Posts
          </Link>
          <a className="docs" href="https://payloadcms.com/docs" rel="noopener noreferrer" target="_blank">
            Payload Docs
          </a>
        </div>
      </div>
    </div>
  )
}
