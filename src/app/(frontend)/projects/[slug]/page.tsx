import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { RenderBlocks } from '@/components/posts/RenderBlocks'
import { isMediaDoc } from '@/components/blocks/shared/isMediaDoc'
import config from '@/payload.config'

const getProjectBySlug = async (slug: string) => {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'projects',
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
      collection: 'projects',
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
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return { title: 'Project Not Found' }
  }

  const featured = project.featuredImage
  const featuredURL = isMediaDoc(featured) ? featured.url : null

  return {
    title: project.title,
    description: project.excerpt || undefined,
    openGraph: {
      title: project.title,
      description: project.excerpt || undefined,
      images: featuredURL
        ? [{ url: featuredURL, alt: project.title }]
        : [{ url: '/icon-512.png', width: 512, height: 512, alt: 'Arrecho Tech' }],
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return (
    <article style={{ margin: '0 auto', maxWidth: 920, padding: '2rem 1.5rem 4rem' }}>
      <header>
        <h1>{project.title}</h1>
        {project.excerpt ? <p>{project.excerpt}</p> : null}
      </header>

      {project.techStack?.length ? (
        <ul>
          {project.techStack.map((t) => (
            <li key={t.id}>{t.name}</li>
          ))}
        </ul>
      ) : null}

      <RenderBlocks blocks={project.layout} />
    </article>
  )
}
