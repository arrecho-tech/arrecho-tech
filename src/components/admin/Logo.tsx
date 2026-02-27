import React from 'react'
import Image from 'next/image'

export function Logo() {
  return (
    <Image
      src="/brand/logo-circle.svg"
      alt="Arrecho Tech"
      width={48}
      height={48}
      priority
    />
  )
}
