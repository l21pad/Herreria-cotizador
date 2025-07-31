import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Handle auth confirmation (email verification)
  if (request.nextUrl.pathname === '/auth/confirm') {
    const token_hash = request.nextUrl.searchParams.get('token_hash')
    const type = request.nextUrl.searchParams.get('type')
    const next = request.nextUrl.searchParams.get('next') ?? '/'

    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type: type as any,
        token_hash,
      })

      if (!error) {
        // Redirect to onboarding or dashboard
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }

    // Return the user to an error page with some instructions
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match only auth confirmation paths to avoid interfering with other routes
     */
    '/auth/confirm',
  ],
};
