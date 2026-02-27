import React from 'react'

import type { Post } from '@/payload-types'

import { CodeBlock } from '@/components/blocks/code/CodeBlock'
import { ContentBlock } from '@/components/blocks/content/ContentBlock'
import { GridBlock } from '@/components/blocks/grid/GridBlock'
import { MediaBlock } from '@/components/blocks/media/MediaBlock'
import { QuoteBlock } from '@/components/blocks/quote/QuoteBlock'

type LayoutBlock = NonNullable<Post['layout']>[number]

const renderBlock = (block: LayoutBlock, index: number) => {
  const key = block.id ?? `${block.blockType}-${index}`

  switch (block.blockType) {
    case 'content':
      return <ContentBlock key={key} block={block} />

    case 'media':
      return <MediaBlock key={key} block={block} />

    case 'grid':
      return <GridBlock key={key} block={block} />

    case 'code':
      return <CodeBlock key={key} block={block} />

    case 'quote':
      return <QuoteBlock key={key} block={block} />

    default:
      return null
  }
}

export const RenderBlocks = ({ blocks }: { blocks: Post['layout'] }) => {
  if (!blocks?.length) {
    return null
  }

  return <>{blocks.map((block, index) => renderBlock(block, index))}</>
}
