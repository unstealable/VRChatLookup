'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ValidationResult } from '@/components/ValidationResult'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ValidationData {
  exists: boolean | null
  available: boolean | null
  type: 'username' | 'email'
  message: string
  timestamp: string
  data?: unknown
}

export default function SearchValidationPage() {
  const params = useParams()
  const { t } = useLanguage()
  const [validationResult, setValidationResult] = useState<ValidationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const type = params.type as 'username' | 'email'
  const value = decodeURIComponent(params.value as string)
  const lang = params.lang as 'fr' | 'en'

  useEffect(() => {
    const validateValue = async () => {
      if (!type || !value || !['username', 'email'].includes(type)) {
        setError('Invalid validation parameters')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/validate?type=${type}&value=${encodeURIComponent(value)}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ValidationData = await response.json()
        setValidationResult(data)
      } catch (err) {
        console.error('Validation error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    validateValue()
  }, [type, value])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">
            {t('validatingValue') || 'Validating...'}
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
            {t('validationError') || 'Validation Error'}
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href={`/${lang}`}>
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToHome') || 'Back to Home'}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {type === 'username' 
              ? (t('usernameValidation') || 'Username Validation')
              : (t('emailValidation') || 'Email Validation')
            }
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('checkingAvailability') || 'Checking availability for'}: <span className="font-mono font-semibold">{value}</span>
          </p>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <div className="mb-8">
            <ValidationResult
              type={validationResult.type}
              value={value}
              userExists={validationResult.exists}
              message={validationResult.message}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="text-center">
          <Link href={`/${lang}`}>
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToHome') || 'Back to Home'}
            </Button>
          </Link>
        </div>

        {/* SEO Content */}
        <div className="mt-12 prose prose-sm max-w-none dark:prose-invert">
          <h2>
            {type === 'username' 
              ? (t('aboutUsernameValidation') || 'About Username Validation')
              : (t('aboutEmailValidation') || 'About Email Validation')
            }
          </h2>
          <p>
            {type === 'username' 
              ? (t('usernameValidationDesc') || 'Check if a VRChat username is available for registration. This tool helps you find the perfect username for your VRChat account.')
              : (t('emailValidationDesc') || 'Verify if an email address is already associated with a VRChat account. Useful for account recovery or checking registration status.')
            }
          </p>
        </div>
      </div>
    </div>
  )
}