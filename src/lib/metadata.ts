import type { Metadata } from 'next'

type Language = 'fr' | 'en'

interface SEOTranslations {
  [key: string]: {
    fr: string
    en: string
  }
}

const seoTranslations: SEOTranslations = {
  siteTitle: {
    fr: 'VRChat Lookup - Recherche Utilisateurs, Mondes et Groupes VRChat',
    en: 'VRChat Lookup - Search VRChat Users, Worlds & Groups'
  },
  siteDescription: {
    fr: 'Découvrez et explorez l\'univers VRChat - Recherchez des utilisateurs, mondes et groupes facilement',
    en: 'Discover and explore the VRChat universe - Search users, worlds, and groups effortlessly'
  },
  userProfile: {
    fr: 'Profil Utilisateur VRChat',
    en: 'VRChat User Profile'
  },
  worldProfile: {
    fr: 'Monde VRChat',
    en: 'VRChat World'
  },
  groupProfile: {
    fr: 'Groupe VRChat',
    en: 'VRChat Group'
  },
  userNotFound: {
    fr: 'Utilisateur Introuvable | VRChat Lookup',
    en: 'User Not Found | VRChat Lookup'
  },
  worldNotFound: {
    fr: 'Monde Introuvable | VRChat Lookup',
    en: 'World Not Found | VRChat Lookup'
  },
  groupNotFound: {
    fr: 'Groupe Introuvable | VRChat Lookup',
    en: 'Group Not Found | VRChat Lookup'
  },
  userNotFoundDesc: {
    fr: 'L\'utilisateur VRChat demandé n\'a pas pu être trouvé. Recherchez des utilisateurs, mondes et groupes VRChat sur VRChat Lookup.',
    en: 'The requested VRChat user could not be found. Search for VRChat users, worlds, and groups on VRChat Lookup.'
  },
  worldNotFoundDesc: {
    fr: 'Le monde VRChat demandé n\'a pas pu être trouvé. Explorez les mondes, utilisateurs et groupes VRChat sur VRChat Lookup.',
    en: 'The requested VRChat world could not be found. Explore VRChat worlds, users, and groups on VRChat Lookup.'
  },
  groupNotFoundDesc: {
    fr: 'Le groupe VRChat demandé n\'a pas pu être trouvé. Découvrez les groupes, utilisateurs et mondes VRChat sur VRChat Lookup.',
    en: 'The requested VRChat group could not be found. Discover VRChat groups, users, and worlds on VRChat Lookup.'
  },
  exploreProfile: {
    fr: 'Explorez le profil VRChat de',
    en: 'Explore'
  },
  findUsers: {
    fr: 'Trouvez des utilisateurs VRChat, consultez leurs mondes, groupes et activités sur VRChat Lookup.',
    en: 'Find VRChat users, view their worlds, groups, and activity on VRChat Lookup.'
  },
  discoverWorld: {
    fr: 'Découvrez',
    en: 'Discover'
  },
  exploreWorlds: {
    fr: 'Explorez les mondes VRChat et les expériences virtuelles sur VRChat Lookup.',
    en: 'Explore VRChat worlds and virtual experiences on VRChat Lookup.'
  },
  joinGroup: {
    fr: 'Rejoignez',
    en: 'Join'
  },
  findGroups: {
    fr: 'Trouvez et rejoignez des groupes et communautés VRChat sur VRChat Lookup.',
    en: 'Find and join VRChat groups and communities on VRChat Lookup.'
  },
  visits: {
    fr: 'visites',
    en: 'visits'
  },
  members: {
    fr: 'membres',
    en: 'members'
  },
  capacity: {
    fr: 'capacité',
    en: 'capacity'
  },
  createdBy: {
    fr: 'Créé par',
    en: 'Created by'
  },
  by: {
    fr: 'par',
    en: 'by'
  }
}


function t(key: string, lang: Language): string {
  return seoTranslations[key]?.[lang] || seoTranslations[key]?.en || key
}

export function getBaseMetadata(lang: Language = 'en'): Metadata {
  return {
    title: {
      default: t('siteTitle', lang),
      template: '%s | VRChat Lookup',
    },
    description: t('siteDescription', lang),
  keywords: process.env.NEXT_PUBLIC_APP_KEYWORDS?.split(',') || [
    'VRChat',
    'VR',
    'Virtual Reality',
    'Social VR',
    'VRChat Users',
    'VRChat Worlds',
    'VRChat Groups',
    'VRChat Search',
    'VRChat Lookup',
    'VRChat Directory'
  ],
  authors: [{ name: process.env.NEXT_PUBLIC_APP_AUTHOR || 'VRCLookup Team' }],
  creator: process.env.NEXT_PUBLIC_APP_AUTHOR || 'VRCLookup Team',
  publisher: process.env.NEXT_PUBLIC_APP_AUTHOR || 'VRCLookup Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vrclookup.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: lang === 'fr' ? 'fr_FR' : 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://vrclookup.vercel.app',
    title: process.env.NEXT_PUBLIC_APP_NAME || 'VRCLookup',
    description: t('siteDescription', lang),
    siteName: process.env.NEXT_PUBLIC_APP_NAME || 'VRCLookup',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_APP_NAME || 'VRCLookup'} - VRChat Search Engine`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_APP_NAME || 'VRCLookup',
    description: t('siteDescription', lang),
    images: ['/og-image.png'],
    creator: '@vrclookup',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_SITE_VERIFICATION,
  },
  category: 'technology',
  classification: 'Virtual Reality, Social Platform, Search Engine',
  referrer: 'origin-when-cross-origin',
  generator: 'Next.js',
  applicationName: process.env.NEXT_PUBLIC_APP_NAME || 'VRCLookup',
  appleWebApp: {
    capable: true,
    title: process.env.NEXT_PUBLIC_APP_NAME || 'VRCLookup',
    statusBarStyle: 'default',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
    ],
  },
  }
}

export const baseMetadata = getBaseMetadata('en')

export function generateUserMetadata(user: { displayName: string; bio?: string; profilePicOverrideThumbnail?: string; currentAvatarThumbnailImageUrl?: string; username?: string; status?: string }, lang: Language = 'en'): Metadata {
  const statusText = user.status ? ` (${user.status})` : ''
  const usernameText = user.username ? ` (@${user.username})` : ''
  const bioText = user.bio ? ` - ${user.bio.slice(0, 120)}...` : ''
  
  return {
    title: `${user.displayName}${usernameText}${statusText} - ${t('userProfile', lang)}`,
    description: `${t('exploreProfile', lang)} ${user.displayName}${bioText} | ${t('findUsers', lang)}`,
    keywords: [
      'VRChat user', 
      user.displayName, 
      user.username || '', 
      'VRChat profile', 
      'VRChat player', 
      'VRChat search', 
      'VRChat lookup', 
      'VRChat directory',
      'virtual reality user',
      'VR social'
    ].filter(Boolean),
    openGraph: {
      title: `${user.displayName} - ${t('userProfile', lang)}`,
      description: `${t('exploreProfile', lang)} ${user.displayName}${user.bio ? `: ${user.bio.slice(0, 100)}...` : ''}`,
      type: 'profile',
      images: user.profilePicOverrideThumbnail || user.currentAvatarThumbnailImageUrl 
        ? [{
            url: user.profilePicOverrideThumbnail || user.currentAvatarThumbnailImageUrl!,
            width: 400,
            height: 400,
            alt: `${user.displayName}'s profile picture`,
          }]
        : undefined,
    },
    twitter: {
      card: 'summary',
      title: `${user.displayName} - ${t('userProfile', lang)}`,
      description: `${t('exploreProfile', lang)} ${user.displayName}${user.bio ? `: ${user.bio.slice(0, 100)}...` : ''}`,
      images: user.profilePicOverrideThumbnail || user.currentAvatarThumbnailImageUrl 
        ? [{
            url: user.profilePicOverrideThumbnail || user.currentAvatarThumbnailImageUrl!,
            width: 400,
            height: 400,
            alt: `${user.displayName}'s profile picture`,
          }]
        : undefined,
    },
  }
}

export function generateWorldMetadata(world: { name: string; authorName?: string; description?: string; thumbnailImageUrl?: string; visitCount?: number; capacity?: number; tags?: string[] }, lang: Language = 'en'): Metadata {
  const authorText = world.authorName ? ` ${t('by', lang)} ${world.authorName}` : ''
  const descText = world.description ? ` - ${world.description.slice(0, 120)}...` : ''
  const visitText = world.visitCount ? ` | ${world.visitCount.toLocaleString()} ${t('visits', lang)}` : ''
  const capacityText = world.capacity ? ` | ${world.capacity} ${t('capacity', lang)}` : ''
  
  return {
    title: `${world.name}${authorText} - ${t('worldProfile', lang)}`,
    description: `${t('discoverWorld', lang)} ${world.name}${authorText}${descText}${visitText}${capacityText} | ${t('exploreWorlds', lang)}`,
    keywords: [
      'VRChat world', 
      world.name, 
      world.authorName || '', 
      'VRChat map', 
      'VRChat experience', 
      'VRChat environment', 
      'VRChat search', 
      'VRChat lookup', 
      'virtual reality world',
      'VR experience',
      ...(world.tags || [])
    ].filter(Boolean),
    openGraph: {
      title: `${world.name} - ${t('worldProfile', lang)}`,
      description: `${t('discoverWorld', lang)} ${world.name}${world.authorName ? ` ${t('by', lang)} ${world.authorName}` : ''}${world.description ? `: ${world.description.slice(0, 100)}...` : ''}`,
      type: 'article',
      images: world.thumbnailImageUrl ? [{
        url: world.thumbnailImageUrl!,
        width: 800,
        height: 600,
        alt: `${world.name} world thumbnail`,
      }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${world.name} - ${t('worldProfile', lang)}`,
      description: `${t('discoverWorld', lang)} ${world.name}${world.authorName ? ` ${t('by', lang)} ${world.authorName}` : ''}${world.description ? `: ${world.description.slice(0, 100)}...` : ''}`,
      images: world.thumbnailImageUrl ? [{
        url: world.thumbnailImageUrl!,
        width: 800,
        height: 600,
        alt: `${world.name} world thumbnail`,
      }] : undefined,
    },
  }
}

export function generateGroupMetadata(group: { name: string; description?: string; iconUrl?: string; memberCount?: number; ownerDisplayName?: string; shortCode?: string }, lang: Language = 'en'): Metadata {
  const descText = group.description ? ` - ${group.description.slice(0, 120)}...` : ''
  const memberText = group.memberCount ? ` | ${group.memberCount.toLocaleString()} ${t('members', lang)}` : ''
  const ownerText = group.ownerDisplayName ? ` | ${t('createdBy', lang)} ${group.ownerDisplayName}` : ''
  const shortCodeText = group.shortCode ? ` (${group.shortCode})` : ''
  
  return {
    title: `${group.name}${shortCodeText} - ${t('groupProfile', lang)}`,
    description: `${t('joinGroup', lang)} ${group.name}${descText}${memberText}${ownerText} | ${t('findGroups', lang)}`,
    keywords: [
      'VRChat group', 
      group.name, 
      group.shortCode || '', 
      'VRChat community', 
      'VRChat clan', 
      'VRChat guild', 
      'VRChat search', 
      'VRChat lookup', 
      'VRChat social', 
      'virtual reality group',
      'VR community'
    ].filter(Boolean),
    openGraph: {
      title: `${group.name} - ${t('groupProfile', lang)}`,
      description: `${t('joinGroup', lang)} ${group.name}${group.description ? `: ${group.description.slice(0, 100)}...` : ''}`,
      type: 'article',
      images: group.iconUrl ? [{
        url: group.iconUrl!,
        width: 400,
        height: 400,
        alt: `${group.name} group icon`,
      }] : undefined,
    },
    twitter: {
      card: 'summary',
      title: `${group.name} - ${t('groupProfile', lang)}`,
      description: `${t('joinGroup', lang)} ${group.name}${group.description ? `: ${group.description.slice(0, 100)}...` : ''}`,
      images: group.iconUrl ? [{
        url: group.iconUrl!,
        width: 400,
        height: 400,
        alt: `${group.name} group icon`,
      }] : undefined,
    },
  }
}