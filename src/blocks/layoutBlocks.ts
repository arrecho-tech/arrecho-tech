import type { Block } from 'payload'

export const ContentBlock: Block = {
  slug: 'content',
  labels: {
    singular: 'Content',
    plural: 'Content Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}

export const MediaBlock: Block = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media Blocks',
  },
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}

export const GridBlock: Block = {
  slug: 'grid',
  labels: {
    singular: 'Grid',
    plural: 'Grid Blocks',
  },
  fields: [
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
  ],
}

export const CodeBlock: Block = {
  slug: 'code',
  labels: {
    singular: 'Code',
    plural: 'Code Blocks',
  },
  fields: [
    {
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'typescript',
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'TSX', value: 'tsx' },
        { label: 'JSX', value: 'jsx' },
        { label: 'JSON', value: 'json' },
        { label: 'Bash', value: 'bash' },
        { label: 'Markdown', value: 'markdown' },
        { label: 'CSS', value: 'css' },
        { label: 'HTML', value: 'html' },
        { label: 'Plain Text', value: 'text' },
      ],
    },
    {
      name: 'code',
      type: 'textarea',
      required: true,
    },
  ],
}

export const QuoteBlock: Block = {
  slug: 'quote',
  labels: {
    singular: 'Quote',
    plural: 'Quote Blocks',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'attribution',
      type: 'text',
    },
  ],
}
