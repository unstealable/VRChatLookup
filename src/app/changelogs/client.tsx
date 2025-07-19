'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowLeft, ChevronRight, Calendar, User, FileText, Filter, ArrowUpDown } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

interface ChangelogEntry {
  id: string
  title: string
  date: string
  version?: string
  author: string
  content: string
  category: string
  changes: {
    type: 'added' | 'changed' | 'fixed' | 'removed'
    description: string
  }[]
}

export default function ChangelogsClient() {
  const { t, language } = useLanguage()
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  const categories = [
    { value: 'all', label: language === 'fr' ? 'Toutes catégories' : 'All Categories' },
    { value: 'feature', label: language === 'fr' ? 'Nouvelles fonctionnalités' : 'New Features' },
    { value: 'improvement', label: language === 'fr' ? 'Améliorations' : 'Improvements' },
    { value: 'bugfix', label: language === 'fr' ? 'Corrections de bugs' : 'Bug Fixes' },
    { value: 'technical', label: language === 'fr' ? 'Technique' : 'Technical' },
    { value: 'ui', label: language === 'fr' ? 'Interface utilisateur' : 'User Interface' },
    { value: 'seo', label: 'SEO' },
    { value: 'general', label: language === 'fr' ? 'Général' : 'General' }
  ]

  useEffect(() => {
    const fetchChangelogs = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory)
        }
        params.append('sort', sortOrder)
        
        const response = await fetch(`/api/changelogs?${params}`)
        const data = await response.json()
        setChangelogs(data)
      } catch (error) {
        console.error('Error fetching changelogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChangelogs()
  }, [selectedCategory, sortOrder])

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToHome')}
          </Link>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {language === 'fr' ? 'Journal des modifications' : 'Changelogs'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t('trackLatestUpdates')}
          </p>
          
          {/* Filtering and Sorting Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {language === 'fr' ? 'Catégorie' : 'Category'}
                </span>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpDown className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {language === 'fr' ? 'Tri' : 'Sort'}
                </span>
              </div>
              <Select value={sortOrder} onValueChange={(value: 'newest' | 'oldest') => setSortOrder(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    {language === 'fr' ? 'Plus récents d\'abord' : 'Newest First'}
                  </SelectItem>
                  <SelectItem value="oldest">
                    {language === 'fr' ? 'Plus anciens d\'abord' : 'Oldest First'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {changelogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {t('noChangelogAvailable')}
            </h2>
            <p className="text-muted-foreground">
              {t('changesWillBeDisplayed')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {changelogs.map((entry) => (
              <div key={entry.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      {entry.title}
                    </h2>
                    <div className="flex items-center text-sm text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(entry.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {entry.author}
                      </div>
                      {entry.version && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                          v{entry.version}
                        </span>
                      )}
                      {entry.category && entry.category !== 'general' && (
                        <span className="bg-muted/50 text-foreground px-2 py-1 rounded text-xs font-medium">
                          {categories.find(c => c.value === entry.category)?.label || entry.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link 
                    href={`/changelogs/${entry.id}`}
                    className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {t('viewDetails')}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                {entry.changes && entry.changes.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                      {t('changes')}
                    </h3>
                    <div className="space-y-2">
                      {entry.changes.map((change, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getChangeTypeColor(change.type)}`}>
                            {t(change.type)}
                          </span>
                          <p className="text-sm text-muted-foreground flex-1">
                            {change.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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