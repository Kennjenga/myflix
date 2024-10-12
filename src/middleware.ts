import { NextRequest, NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"
import { decrypt } from '@/lib/session'

// 1. Specify protected and public routes
const protectedRoutes = ['/content', '/content/', '/user']
const publicRoutes = ['/login', '/signup', '/']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // 2. Check if the current route is protected or public
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith('/content/'))
  const isPublicRoute = publicRoutes.includes(path)

  // 3. Get the NextAuth session token
  const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // 4. Get and decrypt your custom session cookie
  const customCookie = req.cookies.get('session')?.value
  const customSession = customCookie ? await decrypt(customCookie) : null

  // 5. Check if the user is authenticated using either method
  const isAuthenticated = !!nextAuthToken || !!customSession?.userId

  // 6. Redirect to /login if the user is not authenticated on a protected route
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 7. Redirect to /content if the user is authenticated on a public route
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}