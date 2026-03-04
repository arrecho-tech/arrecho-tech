import { getPayload } from 'payload'

import config from '../../src/payload.config.js'

export const contactFormTitle = 'Contact'

export async function seedContactForm(): Promise<void> {
  const payload = await getPayload({ config })

  // Delete any existing Contact form (case-insensitive)
  const existing = await payload.find({
    collection: 'forms',
    limit: 50,
    overrideAccess: true,
  })

  const toDelete = existing.docs.filter(
    (d: any) => String(d?.title ?? '').trim().toLowerCase() === 'contact',
  )

  await Promise.all(
    toDelete.map((d: any) =>
      payload.delete({
        collection: 'forms',
        id: d.id,
        overrideAccess: true,
      }),
    ),
  )

  await payload.create({
    collection: 'forms',
    overrideAccess: true,
    data: {
      title: contactFormTitle,
      confirmationType: 'redirect',
      redirect: {
        url: '/',
      },
      fields: [
        {
          blockType: 'text',
          name: 'name',
          label: 'Name',
          required: true,
        },
        {
          blockType: 'email',
          name: 'email',
          label: 'Email',
          required: true,
        },
        {
          blockType: 'textarea',
          name: 'message',
          label: 'Message',
          required: true,
        },
      ],
    },
  })
}

export async function cleanupContactForm(): Promise<void> {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'forms',
    limit: 50,
    overrideAccess: true,
  })

  const toDelete = existing.docs.filter(
    (d: any) => String(d?.title ?? '').trim().toLowerCase() === 'contact',
  )

  await Promise.all(
    toDelete.map((d: any) =>
      payload.delete({
        collection: 'forms',
        id: d.id,
        overrideAccess: true,
      }),
    ),
  )
}
