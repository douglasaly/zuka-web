import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const SESSION_COOKIE = process.env.APP_SESSION_COOKIE ?? 'zuka_session'

const protectedPrefixes = [
	'/dashboard/seller',
	'/feed/pedidos',
	'/onboarding',
	'/perfil',
	'/mensagens',
	'/admin',
]

export function proxy(request: NextRequest) {
	const session = request.cookies.get(SESSION_COOKIE)?.value
	const { pathname } = request.nextUrl

	const isProtected = protectedPrefixes.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`)
	)

	if (isProtected && !session) {
		const loginUrl = new URL('/auth/login', request.url)
		loginUrl.searchParams.set(
			'next',
			`${request.nextUrl.pathname}${request.nextUrl.search}`
		)
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
		'/perfil/:path*',
		'/mensagens',
		'/mensagens/:path*',
		'/admin',
		'/admin/:path*',
	],
}
