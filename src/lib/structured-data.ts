import { VRChatUser, VRChatWorld, VRChatGroup } from '@/types/vrchat'

export function generateUserStructuredData(user: VRChatUser) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: user.displayName,
    alternateName: user.username,
    description: user.bio,
    image: user.profilePicOverrideThumbnail || user.currentAvatarThumbnailImageUrl,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/user/${user.id}`,
    identifier: user.id,
    dateCreated: user.dateJoined,
    knowsAbout: user.tags,
    sameAs: user.bioLinks,
    additionalType: 'VRChatUser',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}/user/${user.id}`
    },
    ...(user.location && { address: user.location }),
    ...(user.pronouns && { gender: user.pronouns }),
  }
}

export function generateWorldStructuredData(world: VRChatWorld) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: world.name,
    description: world.description,
    image: world.thumbnailImageUrl,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/world/${world.id}`,
    identifier: world.id,
    dateCreated: world.created_at,
    dateModified: world.updated_at,
    additionalType: 'VRChatWorld',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}/world/${world.id}`
    },
    ...(world.authorName && {
      creator: {
        '@type': 'Person',
        name: world.authorName,
        identifier: world.authorId
      }
    }),
    ...(world.capacity && { maximumAttendeeCapacity: world.capacity }),
    ...(world.visitCount && { 
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingCount: world.visitCount,
        bestRating: 5
      }
    }),
    ...(world.tags && { keywords: world.tags.join(', ') }),
    ...(world.featured && { award: 'Featured World' }),
  }
}

export function generateGroupStructuredData(group: VRChatGroup) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: group.name,
    description: group.description,
    image: group.iconUrl,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/group/${group.id}`,
    identifier: group.id,
    dateCreated: group.created_at,
    dateModified: group.updated_at,
    additionalType: 'VRChatGroup',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}/group/${group.id}`
    },
    ...(group.memberCount && { numberOfEmployees: group.memberCount }),
    ...(group.ownerDisplayName && {
      founder: {
        '@type': 'Person',
        name: group.ownerDisplayName,
        identifier: group.ownerId
      }
    }),
    ...(group.shortCode && { alternateName: group.shortCode }),
    ...(group.languages && { inLanguage: group.languages }),
    ...(group.links && { sameAs: group.links }),
    ...(group.rules && { termsOfService: group.rules }),
  }
}

export function generateBreadcrumbStructuredData(items: Array<{name: string, url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VRChat Lookup',
    alternateName: 'VRCLookup',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION_EN,
    url: process.env.NEXT_PUBLIC_APP_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    sameAs: [
      // Add social media profiles if available
    ],
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_APP_AUTHOR,
      url: process.env.NEXT_PUBLIC_APP_URL
    }
  }
}