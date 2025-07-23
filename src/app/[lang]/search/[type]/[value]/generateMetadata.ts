import { Metadata } from 'next'
import { headers, cookies } from 'next/headers'
import { detectServerLanguage } from '@/lib/metadata'

type Props = {
  params: Promise<{ lang: string; type: string; value: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, value } = await params
  const headersList = await headers()
  const cookieStore = await cookies()
  
  const acceptLanguage = headersList.get('accept-language')
  const cookieLang = cookieStore.get('vrchatlookup-language')?.value
  const detectedLang = detectServerLanguage(acceptLanguage, cookieLang) as 'fr' | 'en'
  
  const decodedValue = decodeURIComponent(value)
  const isUsername = type === 'username'
  const isEmail = type === 'email'
  
  if (!isUsername && !isEmail) {
    return {
      title: `Invalid Search • VRChat Lookup`,
      description: 'Invalid search parameters provided.',
    }
  }

  const typeLabel = isUsername 
    ? (detectedLang === 'fr' ? 'Nom d\'utilisateur' : 'Username')
    : (detectedLang === 'fr' ? 'Email' : 'Email')
    
  const availabilityText = detectedLang === 'fr' ? 'Disponibilité' : 'Availability'
  
  const title = `${typeLabel} "${decodedValue}" • ${availabilityText} • VRChat Lookup`
  
  const description = isUsername
    ? (detectedLang === 'fr' 
        ? `Vérifiez si le nom d'utilisateur "${decodedValue}" est disponible sur VRChat. Recherche de disponibilité en temps réel pour votre inscription VRChat.`
        : `Check if the username "${decodedValue}" is available on VRChat. Real-time availability search for your VRChat registration.`)
    : (detectedLang === 'fr'
        ? `Vérifiez si l'adresse email "${decodedValue}" est associée à un compte VRChat. Utile pour la récupération de compte et la vérification d'inscription.`
        : `Check if the email address "${decodedValue}" is associated with a VRChat account. Useful for account recovery and registration verification.`)

  return {
    title,
    description,
    keywords: [
      'VRChat',
      isUsername ? 'username' : 'email',
      'availability',
      'check',
      'validation',
      'registration',
      decodedValue,
      ...(detectedLang === 'fr' ? [
        'disponibilité',
        'vérification', 
        'inscription',
        isUsername ? 'nom d\'utilisateur' : 'email'
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
      canonical: `/${detectedLang}/search/${type}/${encodeURIComponent(decodedValue)}`,
    },
    robots: {
      index: false, // Don't index individual validation pages
      follow: true,
    }
  }
}