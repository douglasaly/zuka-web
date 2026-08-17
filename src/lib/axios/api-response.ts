import { NextResponse } from 'next/server'
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
export function apiSuccess<T>(data: T, status = 200) {
	return NextResponse.json<ApiSuccessResponse<T>>(
		{ success: true, data },
		{ status }
	)
}
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
export function apiCursorList<T>(
	data: T[],
	config: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
	},
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
export function apiError(code: string, message: string, status = 400) {
	return NextResponse.json<ApiErrorResponse>(
		{
			success: false,
			error: { code, message },
		},
		{ status }
	)
}
export const ErrorCode = {
	UNAUTHORIZED: 'UNAUTHORIZED',
	FORBIDDEN: 'FORBIDDEN',
	NOT_FOUND: 'NOT_FOUND',
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	CONFLICT: 'CONFLICT',
	INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const
export { withErrorHandling } from '@/lib/api-handler'
