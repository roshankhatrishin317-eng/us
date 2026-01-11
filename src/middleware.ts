import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { SITE_CONFIG } from './lib/data'

export function middleware(request: NextRequest) {
  // Assume "forever2025" is the cookie value we set upon login
  const isAuthenticated = request.cookies.get('amoria_auth')?.value === 'true'

  // Define protected routes
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/timeline') ||
    request.nextUrl.pathname.startsWith('/map') ||
    request.nextUrl.pathname.startsWith('/vault')

  // If trying to access a protected route without auth, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If already authenticated and trying to access login, redirect to home
  if (request.nextUrl.pathname === '/login' && isAuthenticated) {
     return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/timeline/:path*', '/map/:path*', '/vault/:path*', '/login'],
}
