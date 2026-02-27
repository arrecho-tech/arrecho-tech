import type { Block } from 'payload'

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
