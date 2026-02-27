import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export default async function PostsIndexPage() {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'posts',
    limit: 20,
    sort: '-createdAt',
  })

  return (
    <section style={{ margin: '0 auto', maxWidth: 920, padding: '2rem 1.5rem 4rem' }}>
      <h1>Posts</h1>
      {docs.length === 0 ? (
        <p>No posts yet. Create one in the admin panel to preview your layout blocks.</p>
      ) : (
        <ul>
          {docs.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
