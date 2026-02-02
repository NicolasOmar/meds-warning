import { NextRequest, NextResponse } from 'next/server'
import { AUTH_CONSTANTS, PUBLIC_ROUTES } from '@shared-constants/auth'
import { ROUTE_URLS } from '@shared-constants/routes'
import { verifyJWT } from '@shared-functions/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)

  if (PUBLIC_ROUTES.includes(pathname)) {
    return response
  }

  const token = request.cookies.get(AUTH_CONSTANTS.COOKIE_NAME)?.value

  if (!token || !verifyJWT(token)) {
    return NextResponse.redirect(new URL(ROUTE_URLS.LOGIN, request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)']
}
