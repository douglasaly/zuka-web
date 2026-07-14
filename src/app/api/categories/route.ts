import type { NextRequest } from 'next/server'
import { apiSuccess, withErrorHandling } from '@/lib/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export const GET = withErrorHandling(async (_request: NextRequest) => {
	const supabase = createSupabaseAdmin()

	const { data, error } = await supabase
		.from('categories')
		.select('id, parent_id, name, slug, created_at, updated_at')
		.is('deleted_at', null)
		.order('name')

	if (error) throw error

	return apiSuccess(data)
})
