import { getPayload } from 'payload'

import type { Project } from '../../src/payload-types'
import config from '../../src/payload.config.js'

export const testProject = {
  title: 'E2E Project',
  slug: 'e2e-project',
  excerpt: 'A test project',
  status: 'published',
  techStack: [{ name: 'Next.js' }, { name: 'Payload' }],
  layout: [
    {
      blockType: 'content',
      content: {
        root: {
          type: 'root',
          version: 1,
          direction: 'ltr',
          format: '',
          indent: 0,
          children: [
            {
              type: 'paragraph',
              version: 1,
              format: '',
              indent: 0,
              direction: 'ltr',
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: 'Hello from project content block',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                },
              ],
            },
          ],
        },
      },
    },
  ],
} satisfies Pick<Project, 'title' | 'slug' | 'excerpt' | 'status' | 'techStack' | 'layout'>

export async function seedTestProject(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'projects',
    where: {
      slug: {
        equals: testProject.slug,
      },
    },
  })

  await payload.create({
    collection: 'projects',
    data: testProject,
  })
}

export async function cleanupTestProject(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'projects',
    where: {
      slug: {
        equals: testProject.slug,
      },
    },
  })
}
