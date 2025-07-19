'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { ApiStatusIndicator } from '@/components/ApiStatusIndicator'

interface FooterProps {
  showDisclaimer: boolean
}

export default function Footer({ showDisclaimer }: FooterProps) {
  const { t } = useLanguage()
  
  const appAuthor = process.env.NEXT_PUBLIC_APP_AUTHOR
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-background/50 backdrop-blur-sm border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {appAuthor && (
              <span>
                © {currentYear} {t('copyrightText')} {appAuthor}
              </span>
            )}
            {appUrl && appAuthor && (
              <span className="mx-2 text-border">•</span>
            )}
            {appUrl && (
              <span className="font-medium text-foreground/80 flex items-center gap-2">
                <ApiStatusIndicator />
                {appUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </span>
            )}
          </div>
          
          {showDisclaimer && (
            <div className="text-xs text-muted-foreground/80 text-center md:text-right bg-muted/50 px-3 py-1 rounded-full border border-border/50">
              {t('disclaimerFooter')}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}