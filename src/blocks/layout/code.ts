import type { Block } from 'payload'

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
