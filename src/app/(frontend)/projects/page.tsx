import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export default async function ProjectsIndexPage() {
  let docs: any[] = []

  try {
    const payload = await getPayload({ config: await config })

    const res = await payload.find({
      collection: 'projects',
      limit: 50,
      sort: '-createdAt',
    })

    docs = res.docs
  } catch {
    // During build/CI we may not have a DB available; fall back to an empty list.
    docs = []
  }

  return (
    <section style={{ margin: '0 auto', maxWidth: 920, padding: '2rem 1.5rem 4rem' }}>
      <h1>Projects</h1>
      {docs.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {docs.map((project) => (
            <li key={project.id}>
              <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
