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

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const payload = await getPayload({ config: await config })

    const { docs } = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        status: {
          equals: 'published',
        },
      },
    })

    return (docs ?? [])
      .map((d) => ({ slug: d.slug }))
      .filter((d): d is { slug: string } => typeof d.slug === 'string' && d.slug.length > 0)
  } catch {
    // If we can't reach the DB during build (common in CI), fall back to on-demand rendering.
    return []
  }
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
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'Arrecho Tech' }],
    },
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
