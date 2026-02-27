import React from 'react'

import type { Post } from '@/payload-types'

type Props = {
  block: Extract<NonNullable<Post['layout']>[number], { blockType: 'grid' }>
}

export function GridBlock({ block }: Props) {
  return (
    <section>
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
            style={{
              border: '1px solid #303030',
              borderRadius: 8,
              padding: '1rem',
            }}
          >
            <h3>{card.title}</h3>
            {card.description ? <p>{card.description}</p> : null}
            {card.link ? <a href={card.link}>{card.link}</a> : null}
          </article>
        ))}
      </div>
    </section>
  )
}
