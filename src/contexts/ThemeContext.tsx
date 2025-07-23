'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  effectiveTheme: 'dark' | 'light'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system')
  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('vrchatlookup-theme') as Theme
    if (stored && (stored === 'dark' || stored === 'light' || stored === 'system')) {
      setTheme(stored)
    } else {
      setTheme('system')
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    
    const updateTheme = () => {
      let newEffectiveTheme: 'dark' | 'light'
      
      if (theme === 'system') {
        newEffectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        newEffectiveTheme = theme
      }
      
      setEffectiveTheme(newEffectiveTheme)
      
      root.classList.remove('light', 'dark')
      root.classList.add(newEffectiveTheme)
      
      // Set data attribute for better CSS targeting
      root.setAttribute('data-theme', newEffectiveTheme)
    }

    updateTheme()
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme()
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('vrchatlookup-theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}