import { unstable_cache } from 'next/cache'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export const getCachedCategories = unstable_cache(
	async () => {
		const supabase = createSupabaseAdmin()
		const { data, error } = await supabase
			.from('categories')
			.select('id, parent_id, name, slug, created_at, updated_at')
			.is('deleted_at', null)
			.order('name')
		if (error) throw error
		return data ?? []
	},
	['lookup-categories'],
	{ revalidate: 3600, tags: ['categories'] }
)

export const getCachedProvinces = unstable_cache(
	async () => {
		const supabase = createSupabaseAdmin()
		const { data, error } = await supabase
			.from('provinces')
			.select('id, name, slug, created_at, updated_at')
			.order('name')
		if (error) throw error
		return data ?? []
	},
	['lookup-provinces'],
	{ revalidate: 3600, tags: ['provinces'] }
)
