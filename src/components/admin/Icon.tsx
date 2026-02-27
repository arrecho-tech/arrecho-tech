import React from 'react'
import Image from 'next/image'

export function Icon() {
  return (
    <Image
      src="/brand/logo-circle.svg"
      alt="Arrecho Tech"
      width={28}
      height={28}
      priority
    />
  )
}
