import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

type InviteRow = {
	id: string
	role: string
	invited_at: string | null
	stores:
		| { id: string; name: string; slug: string; deleted_at: string | null }
		| Array<{
				id: string
				name: string
				slug: string
				deleted_at: string | null
		  }>
}

export async function GET() {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const supabase = createSupabaseAdmin()
		const { data, error } = await supabase
			.from('store_members')
			.select(`
				id,
				role,
				invited_at,
				stores!inner (
					id,
					name,
					slug,
					deleted_at
				)
			`)
			.eq('user_id', user.id as string)
			.eq('status', 'pending')
			.is('deleted_at', null)
			.order('invited_at', { ascending: false })
		if (error) throw error
		const invites = ((data ?? []) as unknown as InviteRow[])
			.map((row) => {
				const store = Array.isArray(row.stores)
					? row.stores[0]
					: row.stores
				if (!store || store.deleted_at) return null
				return {
					memberId: row.id,
					role: row.role,
					invitedAt: row.invited_at,
					store: {
						id: store.id,
						name: store.name,
						slug: store.slug,
					},
				}
			})
			.filter(Boolean)
		return NextResponse.json({ success: true, invites })
	} catch (error) {
		console.error('[GET /api/me/store-invites]', error)
		return NextResponse.json(
			{ error: 'Não foi possível carregar convites' },
			{ status: 500 }
		)
	}
}
