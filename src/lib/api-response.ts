import { NextResponse } from 'next/server'

// ─── Types ──────────────────────────────────────────────

export type ApiSuccessResponse<T> = {
	success: true
	data: T
}

export type ApiListResponse<T> = {
	success: true
	data: T[]
	pagination: PaginationMeta
}

export type PaginationMeta = {
	total: number
	limit: number
	offset: number
	hasMore: boolean
	nextCursor: string | null
}

export type ApiErrorResponse = {
	success: false
	error: {
		code: string
		message: string
	}
}

// ─── Response Helpers ───────────────────────────────────

/** Resposta de sucesso com um único objeto. */
export function apiSuccess<T>(data: T, status = 200) {
	return NextResponse.json<ApiSuccessResponse<T>>(
		{ success: true, data },
		{ status }
	)
}

/** Resposta de lista com paginação offset-based. */
export function apiList<T>(
	data: T[],
	pagination: Omit<PaginationMeta, 'nextCursor'> & {
		nextCursor?: string | null
	},
	status = 200
) {
	return NextResponse.json<ApiListResponse<T>>(
		{
			success: true,
			data,
			pagination: {
				...pagination,
				nextCursor: pagination.nextCursor ?? null,
			},
		},
		{ status }
	)
}

/** Resposta de lista com paginação cursor-based (para infinite scroll). */
export function apiCursorList<T>(
	data: T[],
	config: { hasMore: boolean; nextCursor: string | null; limit: number },
	status = 200
) {
	return NextResponse.json(
		{
			success: true as const,
			data,
			pagination: {
				hasMore: config.hasMore,
				nextCursor: config.nextCursor,
				limit: config.limit,
			},
		},
		{ status }
	)
}

/** Resposta de erro padronizada. */
export function apiError(code: string, message: string, status = 400) {
	return NextResponse.json<ApiErrorResponse>(
		{
			success: false,
			error: { code, message },
		},
		{ status }
	)
}

// ─── Códigos de erro comuns ─────────────────────────────

export const ErrorCode = {
	UNAUTHORIZED: 'UNAUTHORIZED',
	FORBIDDEN: 'FORBIDDEN',
	NOT_FOUND: 'NOT_FOUND',
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	CONFLICT: 'CONFLICT',
	INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

// Re-export withErrorHandling for convenience
export { withErrorHandling } from '@/lib/api-handler'
