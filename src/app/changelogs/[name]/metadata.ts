import { Metadata } from 'next'
import { headers } from 'next/headers'

type Props = {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const headersList = await headers()
  
  // Detect language from headers
  const acceptLanguage = headersList.get('accept-language')
  const lang = acceptLanguage?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
  
  // Generate basic metadata without fetching
  const formattedName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  return {
    title: `${formattedName} | VRChat Lookup`,
    description: lang === 'fr' ? 
      `Détails du changelog: ${formattedName}. Voir les modifications et améliorations apportées à VRChat Lookup.` :
      `Changelog details: ${formattedName}. See the changes and improvements made to VRChat Lookup.`,
    keywords: [
      'VRChat Lookup',
      'changelog',
      'updates',
      formattedName,
      ...(lang === 'fr' ? [
        'journal des modifications',
        'mises à jour',
        'détails'
      ] : [])
    ],
    openGraph: {
      title: `${formattedName} - VRChat Lookup`,
      description: lang === 'fr' ? 
        `Détails du changelog: ${formattedName}` :
        `Changelog details: ${formattedName}`,
      type: 'article',
      locale: lang === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title: `${formattedName} - VRChat Lookup`,
      description: lang === 'fr' ? 
        `Détails du changelog: ${formattedName}` :
        `Changelog details: ${formattedName}`,
    },
    alternates: {
      canonical: `/changelogs/${name}`,
    },
  }
}