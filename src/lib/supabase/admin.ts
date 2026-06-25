import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export function createSupabaseAdmin(): SupabaseClient<Database> {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

	if (!url || !serviceRoleKey) {
		throw new Error(
			'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.'
		)
	}

	return createClient<Database>(url, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	}) as SupabaseClient<Database>
}
