import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { RenderBlocks } from '@/components/posts/RenderBlocks'
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

  return {
    title: project.title,
    description: project.excerpt || undefined,
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
