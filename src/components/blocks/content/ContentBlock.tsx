import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { Post } from '@/payload-types'

type Props = {
  block: Extract<NonNullable<Post['layout']>[number], { blockType: 'content' }>
}

export function ContentBlock({ block }: Props) {
  return (
    <section>
      {block.content ? (
        <RichText
          data={block.content as Parameters<typeof RichText>[0]['data']}
        />
      ) : null}
    </section>
  )
}
