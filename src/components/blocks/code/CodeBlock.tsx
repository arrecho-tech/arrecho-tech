import React from 'react'

import type { Post } from '@/payload-types'

type Props = {
  block: Extract<NonNullable<Post['layout']>[number], { blockType: 'code' }>
}

export function CodeBlock({ block }: Props) {
  return (
    <section>
      <pre
        style={{
          background: '#111',
          borderRadius: 8,
          overflowX: 'auto',
          padding: '1rem',
        }}
      >
        <code className={`language-${block.language}`}>{block.code}</code>
      </pre>
    </section>
  )
}
