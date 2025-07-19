'use client'

import React, { useState } from 'react'
import { useValidation } from '@/hooks/useValidation'
import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ValidationInputProps {
  type: 'username' | 'email'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
  required?: boolean
}

export const ValidationInput: React.FC<ValidationInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  className = '',
  label,
  required = false
}) => {
  const { t } = useLanguage()
  const validation = useValidation(type, value)
  const [isFocused, setIsFocused] = useState(false)

  const getStatusIcon = () => {
    if (!value || validation.isLoading) {
      return validation.isLoading ? (
        <Loader className="w-4 h-4 animate-spin text-yellow-500" />
      ) : null
    }

    if (validation.error) {
      return <AlertCircle className="w-4 h-4 text-red-500" />
    }

    if (validation.available === true) {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }

    if (validation.available === false) {
      return <XCircle className="w-4 h-4 text-red-500" />
    }

    return null
  }

  const getStatusMessage = () => {
    if (!value) return ''
    
    if (validation.error) {
      return validation.error
    }

    if (validation.message) {
      return validation.message
    }

    return ''
  }

  const getStatusColor = () => {
    if (validation.error) return 'text-red-500'
    if (validation.available === true) return 'text-green-500'
    if (validation.available === false) return 'text-red-500'
    return 'text-muted-foreground'
  }

  const getBorderColor = () => {
    if (!isFocused && !value) return ''
    
    if (validation.error) return 'border-red-500 focus:border-red-500'
    if (validation.available === true) return 'border-green-500 focus:border-green-500'
    if (validation.available === false) return 'border-red-500 focus:border-red-500'
    if (validation.isLoading) return 'border-yellow-500 focus:border-yellow-500'
    
    return 'border-primary focus:border-primary'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type === 'email' ? 'email' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2 pr-10 border rounded-md 
            bg-background text-foreground
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary/20
            transition-colors
            ${getBorderColor()}
          `}
        />
        
        {/* Status icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getStatusIcon()}
        </div>
      </div>

      {/* Status message */}
      {getStatusMessage() && (
        <p className={`text-xs ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
      )}

      {/* Helper text for validation rules */}
      {!value && type === 'username' && (
        <p className="text-xs text-muted-foreground">
          {t('usernameValidationHelp') || 'Username must be at least 3 characters, letters, numbers, and underscores only'}
        </p>
      )}
    </div>
  )
}