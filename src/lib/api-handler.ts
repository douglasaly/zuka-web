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

/**
 * Wrapper que centraliza o tratamento de erros em todas as rotas API.
 *
 * - Erros do tipo Response (lançados por requireAuth, etc.) são passados diretamente.
 * - Erros do Supabase são logados e retornados como 500.
 * - Erros desconhecidos são tratados como 500 genérico.
 *
 * @example
 * export const GET = withErrorHandling(async (request) => {
 *   const user = await requireAuth()
 *   // ... lógica da rota
 * })
 */
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
