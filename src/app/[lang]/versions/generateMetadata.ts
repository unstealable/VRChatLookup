import { Metadata } from 'next'
import { headers, cookies } from 'next/headers'
import { detectServerLanguage } from '@/lib/metadata'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params
  const headersList = await headers()
  const cookieStore = await cookies()
  
  const acceptLanguage = headersList.get('accept-language')
  const cookieLang = cookieStore.get('vrchatlookup-language')?.value
  const detectedLang = detectServerLanguage(acceptLanguage, cookieLang) as 'fr' | 'en'
  
  const title = detectedLang === 'fr' 
    ? 'Versions • VRChat Lookup'
    : 'Versions • VRChat Lookup'
    
  const description = detectedLang === 'fr'
    ? 'Consultez les dernières mises à jour et commits de VRChatLookup directement depuis GitHub. Historique complet des versions et modifications du code.'
    : 'View the latest updates and commits from VRChatLookup directly from GitHub. Complete version history and code changes.'

  return {
    title,
    description,
    keywords: [
      'VRChat Lookup',
      'versions',
      'updates',
      'commits',
      'GitHub',
      'changelog',
      'release notes',
      'version history',
      ...(detectedLang === 'fr' ? [
        'versions',
        'mises à jour',
        'commits',
        'journal des modifications',
        'historique des versions'
      ] : [])
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: detectedLang === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `/${detectedLang}/versions`,
    },
    robots: {
      index: true,
      follow: true,
    }
  }
}