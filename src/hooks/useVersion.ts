import { useEffect, useState } from 'react'

interface VersionInfo {
  latest: string
  fullSha: string
  date: string
}

export function useVersion() {
  const [version, setVersion] = useState<VersionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('/api/versions?limit=1')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch version: ${response.status}`)
        }

        const data = await response.json()
        setVersion(data.version)
      } catch (err) {
        console.error('Version fetch error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchVersion()
  }, [])

  return { version, loading, error }
}