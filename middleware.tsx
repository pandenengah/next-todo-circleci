import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import authStorage from './services/authStorage';


export function middleware(request: NextRequest) { 
  if (request.nextUrl.pathname.startsWith('/auth')) {
    if (authStorage.isUserHasAccessTokenByReqCookies(request.cookies)) {
      return NextResponse.redirect(new URL('/todo', request.url))
    }
  }
  
  if (request.nextUrl.pathname.startsWith('/todo')) {
    if (!authStorage.isUserHasAccessTokenByReqCookies(request.cookies)) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  if (request.nextUrl.pathname.endsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (request.nextUrl.pathname.endsWith('/')) {
    return NextResponse.redirect(new URL('/todo', request.url))
  }
}
