import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // 1. Define public paths that don't require a token
  const isPublicPath = pathname === '/login' || pathname === '/signup'

  // 2. If no token and trying to access a private path -> Redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 3. If token exists and trying to access login/signup -> Redirect to home
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow the request to continue if none of the above conditions met
  return NextResponse.next()
}

// 4. The Matcher: Tells Next.js which paths to run this middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
