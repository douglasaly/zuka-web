import type { createSupabaseAdmin } from '@/lib/supabase/admin'

type SupabaseAdmin = ReturnType<typeof createSupabaseAdmin>

/**
 * Resolve a category slug to its id plus all descendant subcategory ids.
 * Used by public product listing and search so parent filters include children.
 */
export async function resolveCategoryIds(
	supabase: SupabaseAdmin,
	slug: string
): Promise<string[]> {
	const { data: allCategories, error } = await supabase
		.from('categories')
		.select('id, parent_id, slug')
		.is('deleted_at', null)

	if (error) throw error
	if (!allCategories?.length) return []

	const root = allCategories.find((c) => c.slug === slug)
	if (!root) return []

	const byParent = new Map<string | null, string[]>()
	for (const cat of allCategories) {
		const parentId = (cat.parent_id as string | null) ?? null
		const list = byParent.get(parentId) ?? []
		list.push(cat.id as string)
		byParent.set(parentId, list)
	}

	const ids: string[] = []
	const stack = [root.id as string]
	while (stack.length > 0) {
		const id = stack.pop()
		if (!id) continue
		ids.push(id)
		const children = byParent.get(id) ?? []
		stack.push(...children)
	}
	return ids
}
