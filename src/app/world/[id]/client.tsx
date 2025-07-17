'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { VRChatWorld } from '@/types/vrchat'
import { WorldCard } from '@/components/WorldCard'
import { Navigation } from '@/components/Navigation'
import { StructuredData } from '@/components/StructuredData'
import { useLanguage } from '@/contexts/LanguageContext'
import { generateWorldStructuredData, generateBreadcrumbStructuredData } from '@/lib/structured-data'

export default function WorldClient() {
  const params = useParams()
  const id = params.id
  const [world, setWorld] = useState<VRChatWorld | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (!id) return

    const fetchWorld = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/world/${id}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          return
        }

        if (data.id) {
          setWorld(data)
        } else {
          setError(t('noResults'))
        }
      } catch (err) {
        console.error('Fetch world error:', err)
        setError(t('error'))
      } finally {
        setLoading(false)
      }
    }

    fetchWorld()
  }, [id, t])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  if (!world) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50 relative">
        <Navigation />
        <div className="container mx-auto px-4 py-8 lg:py-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">{t('noResults')}</p>
          </div>
        </div>
      </div>
    )
  }

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: process.env.NEXT_PUBLIC_APP_URL || '' },
    { name: 'Worlds', url: `${process.env.NEXT_PUBLIC_APP_URL}/worlds` },
    { name: world.name, url: `${process.env.NEXT_PUBLIC_APP_URL}/world/${world.id}` }
  ])

  const worldStructuredData = generateWorldStructuredData(world)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 relative">
      <StructuredData data={worldStructuredData} />
      <StructuredData data={breadcrumbData} />
      <Navigation />
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <WorldCard world={world} />
      </div>
    </div>
  )
}