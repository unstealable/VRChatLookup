'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

interface FaviconIconProps {
  url: string
  className?: string
}

export function FaviconIcon({ url, className = "w-4 h-4" }: FaviconIconProps) {
  const [faviconError, setFaviconError] = useState(false)

  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return domain
    } catch {
      return null
    }
  }

  const getFaviconUrl = (url: string) => {
    const domain = getDomain(url)
    if (!domain) return null
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  }

  const domain = getDomain(url)
  const faviconUrl = getFaviconUrl(url)

  if (!domain || !faviconUrl || faviconError) {
    return <ExternalLink className={className} />
  }

  return (
    <img
      src={faviconUrl}
      alt={`${domain} favicon`}
      className={className}
      onError={() => setFaviconError(true)}
      draggable={false}
    />
  )
}