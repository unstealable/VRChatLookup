'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, GitCommit, ExternalLink, User, Calendar } from 'lucide-react'
import Link from 'next/link'

interface GitHubCommit {
  sha: string
  shortSha: string
  message: string
  title: string
  description: string
  author: {
    name: string
    username: string
    avatar: string
    url: string
  }
  date: string
  url: string
}

interface VersionsData {
  commits: GitHubCommit[]
  pagination: {
    page: number
    limit: number
    hasNext: boolean
  }
  version: {
    latest: string
    fullSha: string
    date: string
  }
}

export default function VersionsPage() {
  const params = useParams()
  const { t } = useLanguage()
  const [versionsData, setVersionsData] = useState<VersionsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const lang = params.lang as 'fr' | 'en'

  const fetchVersions = async (pageNumber: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/versions?limit=20&page=${pageNumber}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: VersionsData = await response.json()
      
      if (pageNumber === 1) {
        setVersionsData(data)
      } else {
        // Append to existing commits for pagination
        setVersionsData(prev => prev ? {
          ...data,
          commits: [...prev.commits, ...data.commits]
        } : data)
      }
      
    } catch (err) {
      console.error('Versions fetch error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVersions(1)
  }, [])

  const loadMoreCommits = () => {
    if (versionsData?.pagination.hasNext) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchVersions(nextPage)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && !versionsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">
            {t('loadingVersions') || 'Loading versions...'}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">
            {t('versionsError') || 'Error Loading Versions'}
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => fetchVersions(1)} variant="outline">
              {t('retry') || 'Retry'}
            </Button>
            <Link href={`/${lang}`}>
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backToHome') || 'Back to Home'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('versions') || 'Versions'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {t('versionsDescription') || 'Latest updates and changes from the VRChatLookup repository'}
          </p>
          
          {/* Current Version Badge */}
          {versionsData?.version && (
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GitCommit className="h-4 w-4" />
              <span>{t('currentVersion') || 'Current Version'}: {versionsData.version.latest}</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <Link href={`/${lang}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToHome') || 'Back to Home'}
            </Button>
          </Link>
        </div>

        {/* Commits List */}
        {versionsData?.commits && (
          <div className="space-y-4 mb-8">
            {versionsData.commits.map((commit) => (
              <Card key={commit.sha} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-2">
                        {commit.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <GitCommit className="h-3 w-3" />
                          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                            {commit.shortSha}
                          </code>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{commit.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(commit.date)}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <Link 
                      href={commit.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-4"
                    >
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View on GitHub</span>
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                {commit.description && (
                  <CardContent>
                    <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap font-sans">
                      {commit.description}
                    </pre>
                  </CardContent>
                )}
              </Card>
            ))}
            
            {/* Load More Button */}
            {versionsData.pagination.hasNext && (
              <div className="text-center pt-4">
                <Button 
                  onClick={loadMoreCommits} 
                  variant="outline" 
                  disabled={loading}
                  className="min-w-32"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  ) : (
                    t('loadMore') || 'Load More'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No commits fallback */}
        {versionsData?.commits.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <GitCommit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t('noVersionsAvailable') || 'No versions available'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('noVersionsDescription') || 'Unable to fetch version information from GitHub.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}