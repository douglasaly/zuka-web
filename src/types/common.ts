export type ApiSuccess<T> = {
	success: true
	data: T
}
export type ApiError = {
	success: false
	error: {
		code: string
		message: string
	}
}
export type ApiResponse<T> = ApiSuccess<T> | ApiError
export type CursorPagination = {
	hasMore: boolean
	nextCursor: string | null
	limit: number
}
export type OffsetPagination = {
	total: number
	limit: number
	offset: number
	hasMore: boolean
	nextCursor: string | null
}
export type CursorListResponse<T> = {
	success: true
	data: T[]
	pagination: CursorPagination
}
export type OffsetListResponse<T> = {
	success: true
	data: {
		[key: string]: T[] | OffsetPagination
	}
}
