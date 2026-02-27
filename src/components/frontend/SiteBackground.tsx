'use client'

import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'

type SiteBackgroundProps = {
  imageURLs: string[]
  overlayEnabled?: boolean | null
  overlayOpacity?: number | null
  parallaxEnabled?: boolean | null
  parallaxIntensity?: number | null
}

type PointerOffset = {
  x: number
  y: number
}

const STORAGE_KEY = 'site-settings-selected-background'

export function SiteBackground({
  imageURLs,
  overlayEnabled,
  overlayOpacity,
  parallaxEnabled,
  parallaxIntensity,
}: SiteBackgroundProps) {
  const [selectedImageURL, setSelectedImageURL] = useState<string | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [pointerOffset, setPointerOffset] = useState<PointerOffset>({ x: 0, y: 0 })

  useEffect(() => {
    if (!imageURLs.length) {
      setSelectedImageURL(null)
      return
    }

    const storedURL = window.sessionStorage.getItem(STORAGE_KEY)

    if (storedURL && imageURLs.includes(storedURL)) {
      setSelectedImageURL(storedURL)
      return
    }

    const randomImage = imageURLs[Math.floor(Math.random() * imageURLs.length)]

    if (randomImage) {
      window.sessionStorage.setItem(STORAGE_KEY, randomImage)
      setSelectedImageURL(randomImage)
    }
  }, [imageURLs])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    update()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update)
      return () => mediaQuery.removeEventListener('change', update)
    }

    mediaQuery.addListener(update)
    return () => mediaQuery.removeListener(update)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion || parallaxEnabled === false) {
      setPointerOffset({ x: 0, y: 0 })
      return
    }

    let rafID: number | null = null

    const onMouseMove = (event: MouseEvent) => {
      const nextX = event.clientX / window.innerWidth - 0.5
      const nextY = event.clientY / window.innerHeight - 0.5

      if (rafID !== null) {
        window.cancelAnimationFrame(rafID)
      }

      rafID = window.requestAnimationFrame(() => {
        setPointerOffset({ x: nextX, y: nextY })
      })
    }

    const onMouseLeave = () => {
      setPointerOffset({ x: 0, y: 0 })
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave)

    return () => {
      if (rafID !== null) {
        window.cancelAnimationFrame(rafID)
      }

      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [parallaxEnabled, prefersReducedMotion])

  const iconTransform = useMemo(() => {
    const intensity = Math.max(0, parallaxIntensity ?? 16)

    if (prefersReducedMotion || parallaxEnabled === false || intensity === 0) {
      return 'translate3d(-50%, -50%, 0)'
    }

    return `translate3d(calc(-50% + ${pointerOffset.x * intensity}px), calc(-50% + ${pointerOffset.y * intensity}px), 0)`
  }, [parallaxEnabled, parallaxIntensity, pointerOffset.x, pointerOffset.y, prefersReducedMotion])

  const backgroundTransform = useMemo(() => {
    const intensity = Math.max(0, parallaxIntensity ?? 16)

    if (prefersReducedMotion || parallaxEnabled === false || intensity === 0) {
      return 'translate3d(0px, 0px, 0)'
    }

    return `translate3d(${pointerOffset.x * (-intensity * 0.35)}px, ${pointerOffset.y * (-intensity * 0.35)}px, 0)`
  }, [parallaxEnabled, parallaxIntensity, pointerOffset.x, pointerOffset.y, prefersReducedMotion])

  const resolvedOverlayOpacity = Math.min(1, Math.max(0, overlayOpacity ?? 0.45))

  return (
    <div aria-hidden className="site-background">
      <div
        className="site-background__image"
        data-has-image={selectedImageURL ? 'true' : 'false'}
        data-testid="site-background-image"
        style={{
          backgroundImage: selectedImageURL ? `url('${selectedImageURL}')` : undefined,
          transform: backgroundTransform,
        }}
      />

      {overlayEnabled !== false && (
        <div
          className="site-background__overlay"
          data-testid="site-background-overlay"
          style={{ opacity: resolvedOverlayOpacity }}
        />
      )}

      <Image
        alt=""
        aria-hidden
        className="site-background__icon"
        data-testid="site-background-icon"
        height={220}
        priority
        src="/brand/logo-circle.svg"
        style={{ transform: iconTransform }}
        width={220}
      />
    </div>
  )
}
