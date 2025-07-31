import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Solo manejar la confirmación de email
  if (request.nextUrl.pathname === '/auth/confirm') {
    const token_hash = request.nextUrl.searchParams.get('token_hash')
    const type = request.nextUrl.searchParams.get('type')

    if (token_hash && type) {
      // Redirect to onboarding on successful confirmation
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Return error page if no valid tokens
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/auth/confirm',
  ],
};
