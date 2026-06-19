import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/utils/constants'

export async function proxy(request: NextRequest) {
	const session = request.cookies.get(SESSION_COOKIE)?.value


	const isProtectedRoute =
		request.nextUrl.pathname.startsWith('/dashboard') ||
		request.nextUrl.pathname.startsWith('/profile')

	if (isProtectedRoute && !session) {
		return NextResponse.redirect(new URL('/auth/login', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/dashboard/:path*', '/profile/:path*'],
}
