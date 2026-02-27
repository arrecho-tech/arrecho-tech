import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { RenderBlocks } from '@/components/posts/RenderBlocks'
import config from '@/payload.config'

const getPostBySlug = async (slug: string) => {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return docs[0]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article style={{ margin: '0 auto', maxWidth: 920, padding: '2rem 1.5rem 4rem' }}>
      <header>
        <h1>{post.title}</h1>
        {post.excerpt ? <p>{post.excerpt}</p> : null}
      </header>
      <RenderBlocks blocks={post.layout} />
    </article>
  )
}
