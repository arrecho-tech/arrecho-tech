import type { Block } from 'payload'

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
