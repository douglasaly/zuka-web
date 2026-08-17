import type { NextRequest } from 'next/server'
import { apiSuccess, withErrorHandling } from '@/lib/axios/api-response'
import { getCachedCategories } from '@/lib/cache/lookups'

export const GET = withErrorHandling(async (_request: NextRequest) => {
	const data = await getCachedCategories()
	return apiSuccess(data)
})
