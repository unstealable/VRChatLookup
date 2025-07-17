'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/LanguageContext'
import { SearchType, SearchMethod } from '@/types/vrchat'

interface SearchFormProps {
  onSearch: (query: string, type: SearchType, method: SearchMethod) => void
  loading: boolean
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('users')
  const [searchMethod, setSearchMethod] = useState<SearchMethod>('name')
  const { t, language, setLanguage } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim(), searchType, searchMethod)
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr')
  }

  const isIDFormat = (input: string) => {
    return /^(usr_|wrld_|grp_)[a-f0-9-]+$/i.test(input)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    // Auto-detect ID format
    if (isIDFormat(value)) {
      setSearchMethod('id')
    } else if (searchMethod === 'id' && !isIDFormat(value)) {
      setSearchMethod('name')
    }
  }

  const getPlaceholderText = () => {
    if (searchMethod === 'id') {
      if (searchType === 'users') return 'usr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
      if (searchType === 'worlds') return 'wrld_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
      if (searchType === 'groups') return 'grp_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    }
    return t('searchPlaceholder')
  }

  const isValidForSearchType = () => {
    if (searchType === 'groups' && searchMethod === 'name') {
      return false // Groups can only be searched by ID
    }
    return true
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('searchPlaceholder')}
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="hover:scale-105 transition-transform duration-200"
        >
          {language === 'fr' ? t('switchToEnglish') : t('switchToFrench')}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex rounded-lg border border-input bg-background overflow-hidden flex-1">
            <Input
              type="text"
              placeholder={getPlaceholderText()}
              value={query}
              onChange={handleInputChange}
              disabled={loading}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
              aria-label={t('searchPlaceholder')}
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading || !query.trim() || !isValidForSearchType()}
            className="hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t('loading')}
              </div>
            ) : (
              t('searchButton')
            )}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Search Type Selection */}
          <div className="flex bg-muted rounded-lg p-1">
            {(['users', 'worlds', 'groups'] as SearchType[]).map((type) => (
              <Button
                key={type}
                type="button"
                variant={searchType === type ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setSearchType(type)
                  // Force ID method for groups
                  if (type === 'groups') {
                    setSearchMethod('id')
                  }
                }}
                className={`transition-all duration-200 ${
                  searchType === type 
                    ? 'shadow-md' 
                    : 'hover:bg-background/50'
                }`}
              >
                {t(`search${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof t)}
              </Button>
            ))}
          </div>

          {/* Search Method Selection */}
          {searchType !== 'groups' && (
            <div className="flex bg-muted rounded-lg p-1">
              {(['name', 'id'] as SearchMethod[]).map((method) => (
                <Button
                  key={method}
                  type="button"
                  variant={searchMethod === method ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSearchMethod(method)}
                  className={`transition-all duration-200 ${
                    searchMethod === method 
                      ? 'shadow-md' 
                      : 'hover:bg-background/50'
                  }`}
                >
                  {method === 'name' ? t('searchByName') : 'ID'}
                </Button>
              ))}
            </div>
          )}
        </div>

        {searchType === 'groups' && searchMethod === 'name' && (
          <div className="text-center text-sm text-muted-foreground">
            {t('groupsIdOnly')}
          </div>
        )}
      </form>
    </div>
  )
}