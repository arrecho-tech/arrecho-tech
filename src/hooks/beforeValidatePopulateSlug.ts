import type { CollectionBeforeValidateHook } from 'payload'

import { slugify } from '@/utils/slugify'

type Options = {
  slugField?: string
  sourceField?: string
}

/**
 * Reusable beforeValidate hook to populate a slug field from a source field (e.g. title).
 */
export function beforeValidatePopulateSlug({
  slugField = 'slug',
  sourceField = 'title',
}: Options = {}): CollectionBeforeValidateHook {
  return ({ data }) => {
    if (!data) return data

    const maybeSlug = data[slugField]
    if (typeof maybeSlug === 'string') {
      data[slugField] = slugify(maybeSlug)
      return data
    }

    const maybeSource = data[sourceField]
    if (typeof maybeSource === 'string') {
      data[slugField] = slugify(maybeSource)
    }

    return data
  }
}
