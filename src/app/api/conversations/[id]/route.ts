import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

interface Params {
	params: Promise<{ id: string }>
}

type StoreRow = {
	id: string
	name: string
	logo_url: string | null
	slug: string
	state: string | null
	provinces: { name: string } | null
}

type ConversationRow = {
	id: string
	product_id: string | null
	stores: StoreRow | null
}

export async function GET(_req: Request, { params }: Params) {
	try {
		const { id: conversationId } = await params
		const user = await getSessionUser()

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const supabase = createSupabaseAdmin()

		const { data: participant, error: participantError } = await supabase
			.from('conversation_participants')
			.select('user_id')
			.eq('conversation_id', conversationId)
			.eq('user_id', user.id)
			.single()

		if (participantError && participantError.code !== 'PGRST116') {
			console.error('[GET /api/conversations/:id] participant lookup failed', participantError)
			return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
		}

		if (!participant) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const { data, error } = await supabase
			.from('conversations')
			.select(
				`
				id,
				product_id,
				stores (
					id,
					name,
					logo_url,
					slug,
					state,
					provinces (
						name
					)
				)
			`
			)
			.eq('id', conversationId)
			.is('deleted_at', null)
			.single()

		if (error) throw error

		const row = data as unknown as ConversationRow

		const store = row.stores
			? {
					id: row.stores.id,
					name: row.stores.name,
					logoUrl: row.stores.logo_url,
					slug: row.stores.slug,
					state: row.stores.state,
					provinceName: row.stores.provinces?.name ?? null,
				}
			: null

		return NextResponse.json({
			data: {
				conversationId: row.id,
				productId: row.product_id,
				store,
			},
		})
	} catch (err) {
		console.error('[GET /api/conversations/:id]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
