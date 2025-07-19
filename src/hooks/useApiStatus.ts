import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'

export interface ApiStatus {
  connected: boolean
  status: 'connected' | 'disconnected' | 'error' | 'checking'
  message: string
  lastChecked: Date | null
  isLoading: boolean
}

export function useApiStatus(checkInterval = 30000) { // Check every 30 seconds
  const [status, setStatus] = useState<ApiStatus>({
    connected: false,
    status: 'checking',
    message: 'Checking API status...',
    lastChecked: null,
    isLoading: true
  })

  const checkStatus = async () => {
    try {
      logger.debug('Checking API connectivity status')
      
      const response = await fetch('/api/status', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      logger.info('API status check result', data)

      setStatus({
        connected: data.connected,
        status: data.status,
        message: data.message,
        lastChecked: new Date(),
        isLoading: false
      })

    } catch (error) {
      logger.error('Failed to check API status', error)
      
      setStatus({
        connected: false,
        status: 'error',
        message: 'Failed to check API status',
        lastChecked: new Date(),
        isLoading: false
      })
    }
  }

  useEffect(() => {
    // Initial check
    checkStatus()

    // Set up interval for periodic checks
    const interval = setInterval(checkStatus, checkInterval)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [checkInterval])

  return {
    ...status,
    refresh: checkStatus
  }
}