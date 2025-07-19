'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface DisclaimerPopupProps {
  onClose: () => void
}

export default function DisclaimerPopup({ onClose }: DisclaimerPopupProps) {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`
          bg-background/95 backdrop-blur-sm border-2 border-border rounded-xl max-w-md w-full p-6 shadow-xl
          transform transition-all duration-300
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {t('disclaimerTitle')}
          </h2>
          
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            {t('disclaimerContent')}
          </p>
          
          <button
            onClick={handleClose}
            className="
              bg-primary hover:bg-primary/90 text-primary-foreground
              px-6 py-2 rounded-lg font-medium
              transition-all duration-200 hover:scale-105 shadow-lg
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
            "
          >
            {t('disclaimerButton')}
          </button>
        </div>
      </div>
    </div>
  )
}