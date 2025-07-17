import { Metadata } from 'next'
import { headers } from 'next/headers'

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  
  // Detect language from headers
  const acceptLanguage = headersList.get('accept-language')
  const lang = acceptLanguage?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
  
  return {
    title: lang === 'fr' ? 'Journal des modifications | VRChat Lookup' : 'Changelogs | VRChat Lookup',
    description: lang === 'fr' ? 
      'Suivez les dernières mises à jour, nouvelles fonctionnalités et corrections de bugs de VRChat Lookup. Historique complet des modifications.' :
      'Track the latest updates, new features and bug fixes for VRChat Lookup. Complete change history.',
    keywords: [
      'VRChat Lookup',
      'changelogs',
      'updates',
      'version history',
      'release notes',
      'new features',
      'bug fixes',
      ...(lang === 'fr' ? [
        'journal des modifications',
        'mises à jour',
        'historique des versions',
        'notes de version',
        'nouvelles fonctionnalités',
        'corrections de bugs'
      ] : [])
    ],
    openGraph: {
      title: lang === 'fr' ? 'Journal des modifications - VRChat Lookup' : 'Changelogs - VRChat Lookup',
      description: lang === 'fr' ? 
        'Suivez les dernières mises à jour et améliorations de VRChat Lookup' :
        'Track the latest updates and improvements to VRChat Lookup',
      type: 'website',
      locale: lang === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title: lang === 'fr' ? 'Journal des modifications - VRChat Lookup' : 'Changelogs - VRChat Lookup',
      description: lang === 'fr' ? 
        'Suivez les dernières mises à jour et améliorations de VRChat Lookup' :
        'Track the latest updates and improvements to VRChat Lookup',
    },
    alternates: {
      canonical: '/changelogs',
    },
  }
}