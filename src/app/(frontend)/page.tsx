import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import { ContactForm } from '@/components/forms/ContactForm'
import { FadeIn } from '@/components/frontend/FadeIn'
import { HomeGreeting } from '@/components/frontend/HomeGreeting'
import config from '@/payload.config'
import { findContactForm, sanitizeContactForm } from '@/utils/contactForm'
import './styles.css'

export default async function HomePage() {
  let contactForm: Awaited<ReturnType<typeof findContactForm>> | null = null

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    contactForm = await findContactForm(payload)
  } catch {
    contactForm = null
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="content">
          <picture>
            <source srcSet="/brand/logo-circle.svg" />
            <Image alt="Arrecho Tech" height={130} src="/brand/logo-circle.svg" width={130} />
          </picture>
          <HomeGreeting />
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
