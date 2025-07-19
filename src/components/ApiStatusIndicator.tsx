'use client'

import React, { useState } from 'react'
import { useApiStatus } from '@/hooks/useApiStatus'
import { AlertCircle, CheckCircle, Loader, RefreshCw, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ApiStatusIndicatorProps {
  className?: string
  showLabel?: boolean
}

export const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const { connected, status, message, lastChecked, isLoading, refresh } = useApiStatus()
  const { t } = useLanguage()
  const [showPopup, setShowPopup] = useState(false)

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader className="w-3 h-3 animate-spin text-yellow-500" />
    }
    
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-3 h-3 text-green-500" />
      case 'disconnected':
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />
      default:
        return <Loader className="w-3 h-3 animate-spin text-yellow-500" />
    }
  }

  const getStatusColor = () => {
    if (isLoading) return 'bg-yellow-500'
    
    switch (status) {
      case 'connected':
        return 'bg-green-500'
      case 'disconnected':
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  const getStatusText = () => {
    if (isLoading) return t('checking') || 'Checking...'
    
    switch (status) {
      case 'connected':
        return t('connected') || 'Connected'
      case 'disconnected':
        return t('disconnected') || 'Disconnected'
      case 'error':
        return t('error') || 'Error'
      default:
        return t('unknown') || 'Unknown'
    }
  }

  // Show popup for disconnected/error status
  const shouldShowPopup = !connected && !isLoading && showPopup

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Status indicator dot */}
        <div 
          className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse cursor-pointer`}
          onClick={() => setShowPopup(true)}
          title={message}
        />
        
        {/* Optional label */}
        {showLabel && (
          <span className="text-sm text-muted-foreground">
            {getStatusText()}
          </span>
        )}
      </div>

      {/* Popup for API issues */}
      {shouldShowPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background/95 backdrop-blur-sm border-2 border-border rounded-xl max-w-md w-full p-6 shadow-xl transform transition-all duration-300 scale-100 opacity-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <h3 className="font-semibold text-lg">
                  {t('apiStatusTitle') || 'API Service Status'}
                </h3>
              </div>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {status === 'disconnected' 
                  ? (t('apiDisconnectedMessage') || 'The VRChat API service is currently disconnected. Some features may not work properly.')
                  : (t('apiErrorMessage') || 'There was an error connecting to the VRChat API service. Please try again later.')
                }
              </p>
              
              <div className="text-sm text-muted-foreground">
                <p><strong>{t('status') || 'Status'}:</strong> {getStatusText()}</p>
                <p><strong>{t('message') || 'Message'}:</strong> {message}</p>
                {lastChecked && (
                  <p><strong>{t('lastChecked') || 'Last Checked'}:</strong> {lastChecked.toLocaleTimeString()}</p>
                )}
              </div>
              
              <div className="flex gap-2 justify-end">
                <button
                  onClick={refresh}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {t('refresh') || 'Refresh'}
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 border border-border rounded-md hover:bg-secondary"
                >
                  {t('close') || 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}