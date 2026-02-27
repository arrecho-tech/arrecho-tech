import React from 'react'

import type { Post } from '@/payload-types'

type Props = {
  block: Extract<NonNullable<Post['layout']>[number], { blockType: 'quote' }>
}

export function QuoteBlock({ block }: Props) {
  return (
    <section>
      <blockquote
        style={{ borderLeft: '3px solid #404040', margin: 0, paddingLeft: '1rem' }}
      >
        <p>{block.quote}</p>
        {block.attribution ? <cite>{block.attribution}</cite> : null}
      </blockquote>
    </section>
  )
}
