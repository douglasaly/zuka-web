import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = process.env.APP_SESSION_COOKIE ?? 'zuka_session'

const protectedPrefixes = [
	'/dashboard/seller',
	'/feed/pedidos',
	'/onboarding',
	'/perfil',
	'/admin',
]

export function middleware(request: NextRequest) {
	const session = request.cookies.get(SESSION_COOKIE)?.value
	const { pathname } = request.nextUrl

	const isProtected = protectedPrefixes.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`)
	)

	if (isProtected && !session) {
		const loginUrl = new URL('/auth/login', request.url)
		loginUrl.searchParams.set('next', pathname)
		return NextResponse.redirect(loginUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/dashboard/seller',
		'/dashboard/seller/:path*',
		'/feed/pedidos',
		'/feed/pedidos/:path*',
		'/onboarding',
		'/onboarding/:path*',
		'/perfil',
		'/admin',
		'/admin/:path*',
	],
}
