'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'fr' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')
  const [translations, setTranslations] = useState<Record<string, string>>({})

  useEffect(() => {
    const detectLanguage = (): Language => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('vrclookup-language') as Language
        if (stored && (stored === 'fr' || stored === 'en')) {
          return stored
        }
        
        const browserLang = navigator.language.toLowerCase()
        return browserLang.startsWith('fr') ? 'fr' : 'en'
      }
      return 'en'
    }

    const loadTranslations = async (lang: Language) => {
      try {
        const response = await fetch(`/locales/${lang}.json`)
        const data = await response.json()
        setTranslations(data)
      } catch (error) {
        console.error('Failed to load translations:', error)
      }
    }

    const detectedLang = detectLanguage()
    setLanguage(detectedLang)
    loadTranslations(detectedLang)
    
    // Set initial cookie for server-side access
    if (typeof window !== 'undefined') {
      document.cookie = `vrclookup-language=${detectedLang}; max-age=${60*60*24*365}; path=/; SameSite=lax`
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('vrclookup-language', lang)
      // Set cookie for server-side access
      document.cookie = `vrclookup-language=${lang}; max-age=${60*60*24*365}; path=/; SameSite=lax`
    }
    
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${lang}.json`)
        const data = await response.json()
        setTranslations(data)
      } catch (error) {
        console.error('Failed to load translations:', error)
      }
    }
    
    loadTranslations()
  }

  const t = (key: string): string => {
    return translations[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}