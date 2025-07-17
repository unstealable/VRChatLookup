'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowLeft, Calendar, User, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import Link from 'next/link'

interface ChangelogEntry {
  id: string
  title: string
  date: string
  version?: string
  author: string
  content: string
  changes: {
    type: 'added' | 'changed' | 'fixed' | 'removed'
    description: string
  }[]
}

export default function ChangelogDetailsClient() {
  const { name } = useParams()
  const { t, language } = useLanguage()
  const [changelog, setChangelog] = useState<ChangelogEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await fetch('/api/changelogs')
        const data = await response.json()
        const foundChangelog = data.find((c: ChangelogEntry) => c.id === name)
        setChangelog(foundChangelog || null)
      } catch (error) {
        console.error('Error fetching changelog:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChangelog()
  }, [name])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            {t('loadingChangelogs')}
          </p>
        </div>
      </div>
    )
  }

  if (!changelog) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link 
            href="/changelogs" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToChangelogs')}
          </Link>
          
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t('changelogNotFound')}
            </h1>
            <p className="text-muted-foreground">
              {t('changelogNotFoundDesc')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link 
          href="/changelogs" 
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToChangelogs')}
        </Link>
        
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground">
                {changelog.title}
              </h1>
              {changelog.version && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  v{changelog.version}
                </span>
              )}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(changelog.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {changelog.author}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Changes Section - Always visible */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {t('changes')}
              </h2>
              <div className="space-y-3">
                {changelog.changes.map((change, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getChangeTypeColor(change.type)}`}>
                      {t(change.type)}
                    </span>
                    <p className="text-foreground flex-1">
                      {change.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Details Section - Collapsible */}
            {changelog.content && (
              <div className="border-t border-border pt-6">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-between w-full text-left group"
                >
                  <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t('technicalDetails')}
                  </h2>
                  {showDetails ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </button>
                
                {showDetails && (
                  <div className="mt-4 prose prose-gray dark:prose-invert max-w-none">
                    <div 
                      className="text-foreground"
                      dangerouslySetInnerHTML={{ __html: changelog.content }} 
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getChangeTypeColor(type: string): string {
  switch (type) {
    case 'added':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'changed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'fixed':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    case 'removed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}