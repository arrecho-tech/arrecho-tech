export type OptimizedImageOptions = {
  width?: number
  quality?: number
}

/**
 * Build an optimized image URL for Vercel Blob-hosted images by appending
 * width/quality query parameters. Existing query parameters are preserved.
 */
export function getOptimizedImageUrl(originalUrl: string | null | undefined, options: OptimizedImageOptions = {}): string | null {
  if (!originalUrl) return null

  try {
    const url = new URL(originalUrl)

    if (options.width && Number.isFinite(options.width)) {
      url.searchParams.set('w', String(options.width))
    }

    if (options.quality && Number.isFinite(options.quality)) {
      url.searchParams.set('q', String(options.quality))
    }

    // Ask Vercel's image pipeline to choose an appropriate format when supported
    if (!url.searchParams.has('auto')) {
      url.searchParams.set('auto', 'format')
    }

    return url.toString()
  } catch {
    // If URL parsing fails (e.g. relative URL), just return the original string
    return originalUrl
  }
}
