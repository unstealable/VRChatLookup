import { NextRequest, NextResponse } from 'next/server'

function detectLanguageFromRequest(request: NextRequest): 'fr' | 'en' {
  // Check cookie first
  const cookieLang = request.cookies.get('vrchatlookup-language')?.value
  if (cookieLang === 'fr' || cookieLang === 'en') {
    return cookieLang
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage && acceptLanguage.toLowerCase().includes('fr')) {
    return 'fr'
  }

  return 'en' // Default
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()

  // Skip middleware for static files, API routes, and special Next.js paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/site.webmanifest'
  ) {
    return NextResponse.next()
  }

  // Handle validation URLs: /[lang]/search/[type]/[value]
  const validationMatch = pathname.match(/^\/([a-z]{2})\/search\/(username|email)\/(.+)$/)
  if (validationMatch) {
    const [, pathLang, , value] = validationMatch
    if ((pathLang === 'fr' || pathLang === 'en') && value) {
      // Set language cookie for validation pages
      const response = NextResponse.next()
      response.cookies.set('vrchatlookup-language', pathLang, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax'
      })
      return response
    }
  }

  const detectedLang = detectLanguageFromRequest(request)

  // Handle VRChat-style URLs with /home/ prefix
  if (pathname.startsWith('/home/')) {
    let redirectPath = ''

    // Handle user URLs: /home/user/usr_xxx -> /[lang]/user/usr_xxx
    if (pathname.match(/^\/home\/user\/usr_[a-f0-9-]+$/i)) {
      redirectPath = `/${detectedLang}${pathname.replace('/home', '')}`
    }
    
    // Handle world URLs: /home/world/wrld_xxx/info -> /[lang]/world/wrld_xxx
    // Also handle: /home/world/wrld_xxx -> /[lang]/world/wrld_xxx  
    else if (pathname.match(/^\/home\/world\/wrld_[a-f0-9-]+(\/info)?$/i)) {
      redirectPath = `/${detectedLang}${pathname.replace('/home', '').replace('/info', '')}`
    }
    
    // Handle group URLs: /home/group/grp_xxx -> /[lang]/group/grp_xxx
    else if (pathname.match(/^\/home\/group\/grp_[a-f0-9-]+$/i)) {
      redirectPath = `/${detectedLang}${pathname.replace('/home', '')}`
    }

    if (redirectPath) {
      url.pathname = redirectPath
      const response = NextResponse.redirect(url, 301)
      // Set language cookie
      response.cookies.set('vrchatlookup-language', detectedLang, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax'
      })
      return response
    }
  }

  // Check if the pathname already has a language prefix
  const hasLangPrefix = /^\/(?:fr|en)(?:\/|$)/.test(pathname)

  // If no language prefix, redirect to the detected language version
  if (!hasLangPrefix && pathname !== '/') {
    url.pathname = `/${detectedLang}${pathname}`
    const response = NextResponse.redirect(url, 302)
    // Set language cookie
    response.cookies.set('vrchatlookup-language', detectedLang, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax'
    })
    return response
  }

  // Handle root path redirect
  if (pathname === '/') {
    url.pathname = `/${detectedLang}`
    const response = NextResponse.redirect(url, 302)
    // Set language cookie
    response.cookies.set('vrchatlookup-language', detectedLang, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax'
    })
    return response
  }

  // Extract language from path and set cookie if different
  const pathLangMatch = pathname.match(/^\/([a-z]{2})/)
  if (pathLangMatch) {
    const pathLang = pathLangMatch[1] as 'fr' | 'en'
    if ((pathLang === 'fr' || pathLang === 'en') && pathLang !== detectedLang) {
      // Update cookie to match current path language
      const response = NextResponse.next()
      response.cookies.set('vrchatlookup-language', pathLang, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax'
      })
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!_next/static|_next/image|favicon|api).*)',
  ]
}