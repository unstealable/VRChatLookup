import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'

export interface ValidationResult {
  exists: boolean | null
  available: boolean | null
  type: 'username' | 'email'
  message: string
  isLoading: boolean
  error: string | null
}

export function useValidation(type: 'username' | 'email', value: string, debounceMs = 500) {
  const [result, setResult] = useState<ValidationResult>({
    exists: null,
    available: null,
    type,
    message: '',
    isLoading: false,
    error: null
  })

  useEffect(() => {
    // Reset state when value changes
    setResult(prev => ({
      ...prev,
      isLoading: false,
      error: null,
      exists: null,
      available: null,
      message: ''
    }))

    // Don't validate empty values
    if (!value || value.trim().length === 0) {
      return
    }

    // Basic validation for email format
    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setResult(prev => ({
        ...prev,
        error: 'Invalid email format',
        message: 'Please enter a valid email address'
      }))
      return
    }

    // Basic validation for username (3+ chars, alphanumeric + underscore)
    if (type === 'username' && (value.length < 3 || !/^[a-zA-Z0-9_]+$/.test(value))) {
      setResult(prev => ({
        ...prev,
        error: 'Invalid username format',
        message: 'Username must be at least 3 characters and contain only letters, numbers, and underscores'
      }))
      return
    }

    // Debounce the API call
    const timeoutId = setTimeout(async () => {
      setResult(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }))

      try {
        logger.debug(`Validating ${type}: ${value}`)
        
        const response = await fetch(`/api/validate?type=${type}&value=${encodeURIComponent(value)}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        setResult({
          exists: data.exists,
          available: data.available,
          type,
          message: data.message,
          isLoading: false,
          error: null
        })

        logger.info(`Validation result for ${type}`, {
          type,
          exists: data.exists,
          available: data.available
        })

      } catch (error) {
        logger.error(`Validation failed for ${type}`, error)
        
        setResult(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Validation failed',
          message: 'Unable to check availability'
        }))
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [type, value, debounceMs])

  return result
}