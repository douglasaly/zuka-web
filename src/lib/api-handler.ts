import type { NextRequest, NextResponse } from 'next/server'
import { apiError, ErrorCode } from '@/lib/api-response'

type RouteContext = { params: Promise<Record<string, string>> }

type HandlerFn = (
	request: NextRequest,
	context: RouteContext
) => Promise<NextResponse | Response>

type WrappedHandler = (
	request: NextRequest,
	context?: RouteContext
) => Promise<NextResponse | Response>

export function withErrorHandling(handler: HandlerFn): WrappedHandler {
	return async (request, context) => {
		try {
			return await handler(request, context as RouteContext)
		} catch (error) {
			// Response objects thrown by auth helpers (requireAuth, etc.)
			if (error instanceof Response) {
				return error
			}

			const path = request.nextUrl.pathname
			console.error(`[API] ${request.method} ${path}`, error)

			return apiError(
				ErrorCode.INTERNAL_ERROR,
				'Erro interno do servidor',
				500
			)
		}
	}
}

export type { RouteContext }
