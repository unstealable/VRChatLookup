import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle VRChat-style URLs with /home/ prefix
  if (pathname.startsWith('/home/')) {
    let redirectPath = ''

    // Handle user URLs: /home/user/usr_xxx -> /user/usr_xxx
    if (pathname.match(/^\/home\/user\/usr_[a-f0-9-]+$/i)) {
      redirectPath = pathname.replace('/home/user/', '/user/')
    }
    
    // Handle world URLs: /home/world/wrld_xxx/info -> /world/wrld_xxx
    // Also handle: /home/world/wrld_xxx -> /world/wrld_xxx  
    else if (pathname.match(/^\/home\/world\/wrld_[a-f0-9-]+(\/info)?$/i)) {
      redirectPath = pathname.replace('/home/world/', '/world/').replace('/info', '')
    }
    
    // Handle group URLs: /home/group/grp_xxx -> /group/grp_xxx
    else if (pathname.match(/^\/home\/group\/grp_[a-f0-9-]+$/i)) {
      redirectPath = pathname.replace('/home/group/', '/group/')
    }

    if (redirectPath) {
      const url = request.nextUrl.clone()
      url.pathname = redirectPath
      return NextResponse.redirect(url, 301) // Permanent redirect
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/home/user/:path*',
    '/home/world/:path*', 
    '/home/group/:path*'
  ]
}