import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import { ContactForm } from '@/components/forms/ContactForm'
import { FadeIn } from '@/components/frontend/FadeIn'
import config from '@/payload.config'
import { findContactForm, sanitizeContactForm } from '@/utils/contactForm'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const contactForm = await findContactForm(payload)

  return (
    <div className="home">
      <section className="hero">
        <div className="content">
          <picture>
            <source srcSet="/brand/logo-circle.svg" />
            <Image alt="Arrecho Tech" height={130} src="/brand/logo-circle.svg" width={130} />
          </picture>
          {!user && <h1>Welcome to Arrecho Tech.</h1>}
          {user && <h1>Welcome back, {user.firstName}</h1>}
        </div>
      </section>

      {contactForm ? (
        <section className="contact">
          <FadeIn>
            <ContactForm form={sanitizeContactForm(contactForm)} />
          </FadeIn>
        </section>
      ) : null}
    </div>
  )
}
