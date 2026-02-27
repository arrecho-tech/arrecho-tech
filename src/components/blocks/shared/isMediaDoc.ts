import type { Media } from '@/payload-types'

export const isMediaDoc = (media: number | Media | null | undefined): media is Media =>
  typeof media === 'object' && media !== null
