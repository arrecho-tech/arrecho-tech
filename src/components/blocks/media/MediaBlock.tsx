import Image from 'next/image'
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

  const width = typeof media.width === 'number' ? media.width : null
  const height = typeof media.height === 'number' ? media.height : null

  return (
    <figure>
      <div
        style={
          width && height
            ? { height: 'auto', width: '100%' }
            : {
                position: 'relative',
                width: '100%',
                // reasonable default aspect ratio if we don't have dimensions
                aspectRatio: '16 / 9',
              }
        }
      >
        {width && height ? (
          <Image
            alt={media.alt || ''}
            src={media.url}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 920px"
            style={{ height: 'auto', width: '100%' }}
          />
        ) : (
          <Image
            alt={media.alt || ''}
            src={media.url}
            fill
            sizes="(max-width: 768px) 100vw, 920px"
            style={{ objectFit: 'contain' }}
          />
        )}
      </div>

      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  )
}
