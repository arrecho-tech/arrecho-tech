import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { CodeBlock, ContentBlock, GridBlock, MediaBlock, QuoteBlock } from '@/blocks/layoutBlocks'

const formatSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const populateSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) {
    return data
  }

  if (typeof data.slug === 'string') {
    data.slug = formatSlug(data.slug)
    return data
  }

  if (typeof data.title === 'string') {
    data.slug = formatSlug(data.title)
  }

  return data
}

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
    beforeValidate: [populateSlug],
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
      blocks: [ContentBlock, MediaBlock, GridBlock, CodeBlock, QuoteBlock],
    },
  ],
}
