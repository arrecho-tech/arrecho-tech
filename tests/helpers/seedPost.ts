import { getPayload } from 'payload'

import type { Post } from '../../src/payload-types'
import config from '../../src/payload.config.js'

export const testPost = {
  title: 'Payload Blocks E2E Post',
  slug: 'payload-blocks-e2e-post',
  excerpt: 'A test post that validates block rendering in the frontend.',
  layout: [
    {
      blockType: 'grid',
      cards: [
        {
          title: 'Card 1',
          description: 'Grid card rendered from block data',
          link: '/posts',
        },
      ],
    },
    {
      blockType: 'code',
      language: 'typescript',
      code: 'const hello = "from code block"',
    },
    {
      blockType: 'quote',
      quote: 'The details are not the details. They make the design.',
      attribution: 'Charles Eames',
    },
  ],
  status: 'published',
} satisfies Pick<Post, 'title' | 'slug' | 'excerpt' | 'layout' | 'status'>

export async function seedTestPost(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'posts',
    where: {
      slug: {
        equals: testPost.slug,
      },
    },
  })

  await payload.create({
    collection: 'posts',
    data: testPost,
  })
}

export async function cleanupTestPost(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'posts',
    where: {
      slug: {
        equals: testPost.slug,
      },
    },
  })
}
