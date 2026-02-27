import React from 'react'

import type { Post } from '@/payload-types'
import { isMediaDoc } from '@/components/blocks/shared/isMediaDoc'

type Props = {
  block: Extract<NonNullable<Post['layout']>[number], { blockType: 'media' }>
}

export function MediaBlock({ block }: Props) {
  const media = block.media

  if (!isMediaDoc(media) || !media.url) {
    return null
  }

  return (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={media.alt || ''} loading="lazy" src={media.url} />
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  )
}
