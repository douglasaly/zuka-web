import { NextResponse } from 'next/server'
import { withErrorHandling } from '@/lib/axios/api-response'
import { getCachedProvinces } from '@/lib/cache/lookups'

export const GET = withErrorHandling(async () => {
	const data = await getCachedProvinces()
	return NextResponse.json(data)
})
