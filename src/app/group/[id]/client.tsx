'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { VRChatGroup } from '@/types/vrchat'
import { GroupCard } from '@/components/GroupCard'
import { Navigation } from '@/components/Navigation'
import { StructuredData } from '@/components/StructuredData'
import { useLanguage } from '@/contexts/LanguageContext'
import { generateGroupStructuredData, generateBreadcrumbStructuredData } from '@/lib/structured-data'

export default function GroupClient() {
  const params = useParams()
  const id = params.id
  const [group, setGroup] = useState<VRChatGroup | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (!id) return

    const fetchGroup = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/group/${id}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          return
        }

        if (data.id) {
          setGroup(data)
        } else {
          setError(t('noResults'))
        }
      } catch (err) {
        console.error('Fetch group error:', err)
        setError(t('error'))
      } finally {
        setLoading(false)
      }
    }

    fetchGroup()
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

  if (!group) {
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
    { name: 'Groups', url: `${process.env.NEXT_PUBLIC_APP_URL}/groups` },
    { name: group.name, url: `${process.env.NEXT_PUBLIC_APP_URL}/group/${group.id}` }
  ])

  const groupStructuredData = generateGroupStructuredData(group)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 relative">
      <StructuredData data={groupStructuredData} />
      <StructuredData data={breadcrumbData} />
      <Navigation />
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <GroupCard group={group} />
      </div>
    </div>
  )
}