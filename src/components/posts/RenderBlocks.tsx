import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { Media, Post } from '@/payload-types'

type LayoutBlock = NonNullable<Post['layout']>[number]

const isMediaDoc = (media: number | Media | null | undefined): media is Media =>
  typeof media === 'object' && media !== null

const renderBlock = (block: LayoutBlock, index: number) => {
  const key = block.id ?? `${block.blockType}-${index}`

  switch (block.blockType) {
    case 'content':
      return (
        <section key={key}>
          {block.content ? <RichText data={block.content as Parameters<typeof RichText>[0]['data']} /> : null}
        </section>
      )

    case 'media': {
      const media = block.media

      if (!isMediaDoc(media) || !media.url) {
        return null
      }

      return (
        <figure key={key}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={media.alt || ''} loading="lazy" src={media.url} />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      )
    }

    case 'grid':
      return (
        <section key={key}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            {block.cards?.map((card) => (
              <article
                key={card.id}
                style={{ border: '1px solid #303030', borderRadius: 8, padding: '1rem' }}
              >
                <h3>{card.title}</h3>
                {card.description ? <p>{card.description}</p> : null}
                {card.link ? <a href={card.link}>{card.link}</a> : null}
              </article>
            ))}
          </div>
        </section>
      )

    case 'code':
      return (
        <section key={key}>
          <pre style={{ background: '#111', borderRadius: 8, overflowX: 'auto', padding: '1rem' }}>
            <code className={`language-${block.language}`}>{block.code}</code>
          </pre>
        </section>
      )

    case 'quote':
      return (
        <section key={key}>
          <blockquote style={{ borderLeft: '3px solid #404040', margin: 0, paddingLeft: '1rem' }}>
            <p>{block.quote}</p>
            {block.attribution ? <cite>{block.attribution}</cite> : null}
          </blockquote>
        </section>
      )

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
