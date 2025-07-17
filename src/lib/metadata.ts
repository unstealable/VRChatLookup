import type { Metadata } from 'next'

export const baseMetadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME || 'VRCLookup',
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'VRCLookup'}`,
  },
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Discover and explore the VRChat universe - Search users, worlds, and groups effortlessly',
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
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://vrclookup.vercel.app',
    title: process.env.NEXT_PUBLIC_APP_NAME || 'VRCLookup',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Discover and explore the VRChat universe - Search users, worlds, and groups effortlessly',
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
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Discover and explore the VRChat universe - Search users, worlds, and groups effortlessly',
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

export function generateUserMetadata(user: { displayName: string; bio?: string; profilePicOverrideThumbnail?: string; currentAvatarThumbnailImageUrl?: string }): Metadata {
  return {
    title: `${user.displayName} - User Profile`,
    description: `View ${user.displayName}'s VRChat profile${user.bio ? `: ${user.bio.slice(0, 100)}...` : ''}`,
    openGraph: {
      title: `${user.displayName} - VRChat User Profile`,
      description: `View ${user.displayName}'s VRChat profile${user.bio ? `: ${user.bio.slice(0, 100)}...` : ''}`,
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
      title: `${user.displayName} - VRChat User Profile`,
      description: `View ${user.displayName}'s VRChat profile${user.bio ? `: ${user.bio.slice(0, 100)}...` : ''}`,
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

export function generateWorldMetadata(world: { name: string; authorName?: string; description?: string; thumbnailImageUrl?: string }): Metadata {
  return {
    title: `${world.name} - World`,
    description: `Explore ${world.name}${world.authorName ? ` by ${world.authorName}` : ''}${world.description ? `: ${world.description.slice(0, 100)}...` : ''}`,
    openGraph: {
      title: `${world.name} - VRChat World`,
      description: `Explore ${world.name}${world.authorName ? ` by ${world.authorName}` : ''}${world.description ? `: ${world.description.slice(0, 100)}...` : ''}`,
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
      title: `${world.name} - VRChat World`,
      description: `Explore ${world.name}${world.authorName ? ` by ${world.authorName}` : ''}${world.description ? `: ${world.description.slice(0, 100)}...` : ''}`,
      images: world.thumbnailImageUrl ? [{
        url: world.thumbnailImageUrl!,
        width: 800,
        height: 600,
        alt: `${world.name} world thumbnail`,
      }] : undefined,
    },
  }
}

export function generateGroupMetadata(group: { name: string; description?: string; iconUrl?: string }): Metadata {
  return {
    title: `${group.name} - Group`,
    description: `Join ${group.name}${group.description ? `: ${group.description.slice(0, 100)}...` : ''}`,
    openGraph: {
      title: `${group.name} - VRChat Group`,
      description: `Join ${group.name}${group.description ? `: ${group.description.slice(0, 100)}...` : ''}`,
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
      title: `${group.name} - VRChat Group`,
      description: `Join ${group.name}${group.description ? `: ${group.description.slice(0, 100)}...` : ''}`,
      images: group.iconUrl ? [{
        url: group.iconUrl!,
        width: 400,
        height: 400,
        alt: `${group.name} group icon`,
      }] : undefined,
    },
  }
}