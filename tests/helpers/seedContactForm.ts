import { getPayload } from 'payload'

import config from '../../src/payload.config.js'

export const contactFormTitle = 'Contact'

async function deleteContactFormSubmissions(payload: any, formId: string | number) {
  // Payload's form-builder plugin sometimes nulls out form_submissions.form_id on form delete.
  // That fails when the DB column is NOT NULL. We avoid it by deleting submissions first.
  while (true) {
    const subs = await payload.find({
      collection: 'form-submissions',
      limit: 100,
      overrideAccess: true,
      where: {
        form: {
          equals: formId,
        },
      },
    })

    if (!subs.docs?.length) break

    await Promise.all(
      subs.docs.map((s: any) =>
        payload.delete({
          collection: 'form-submissions',
          id: s.id,
          overrideAccess: true,
        }),
      ),
    )

    if (subs.docs.length < 100) break
  }
}

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
    toDelete.map(async (d: any) => {
      await deleteContactFormSubmissions(payload, d.id)

      return payload.delete({
        collection: 'forms',
        id: d.id,
        overrideAccess: true,
      })
    }),
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
    toDelete.map(async (d: any) => {
      await deleteContactFormSubmissions(payload, d.id)

      return payload.delete({
        collection: 'forms',
        id: d.id,
        overrideAccess: true,
      })
    }),
  )
}
