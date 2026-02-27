import type { CollectionConfig } from 'payload'

import { LayoutBlocks } from '@/blocks/layout'
import { beforeValidatePopulateSlug } from '@/hooks/beforeValidatePopulateSlug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
      name: 'layout',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: LayoutBlocks,
    },
  ],
}
