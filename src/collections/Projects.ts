import type { CollectionConfig } from 'payload'

import { LayoutBlocks } from '@/blocks/layout'
import { beforeValidatePopulateSlug } from '@/hooks/beforeValidatePopulateSlug'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: ({ req }) => {
      if (req.user) return true

      return {
        status: {
          equals: 'published',
        },
      }
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  hooks: {
    beforeValidate: [beforeValidatePopulateSlug({ sourceField: 'title' })],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Generated from title if omitted.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'techStack',
      type: 'array',
      minRows: 0,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Simple list of tech used (e.g. Rust, Next.js, Postgres).',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: LayoutBlocks,
    },
  ],
}
