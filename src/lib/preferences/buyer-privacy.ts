import { normalizePreferences } from '@/lib/preferences/schema'
import type { createSupabaseAdmin } from '@/lib/supabase/admin'

type Db = ReturnType<typeof createSupabaseAdmin>

export async function getBuyerProfileVisibilityMap(
	db: Db,
	buyerIds: string[]
): Promise<Map<string, boolean>> {
	const map = new Map<string, boolean>()
	const unique = [...new Set(buyerIds)]
	for (const id of unique) {
		map.set(id, true)
	}
	if (unique.length === 0) return map

	const { data, error } = await db
		.from('user_preferences')
		.select('user_id, prefs')
		.in('user_id', unique)
		.is('deleted_at', null)
	if (error) throw error

	for (const row of data ?? []) {
		const prefs = normalizePreferences(row.prefs)
		map.set(row.user_id, prefs.buyer.privacy.profileVisible)
	}
	return map
}

export function buyerDisplayName(
	profileVisible: boolean,
	firstName: string | null | undefined,
	lastName: string | null | undefined
): string {
	if (!profileVisible) return 'Cliente'
	const name = [firstName, lastName].filter(Boolean).join(' ').trim()
	return name || 'Cliente'
}
