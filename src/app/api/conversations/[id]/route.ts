import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { getManagedStoreIds } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

interface Params {
	params: Promise<{ id: string }>
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
			console.error(
				'[GET /api/conversations/:id] participant lookup failed',
				participantError
			)
			return NextResponse.json(
				{ error: 'Internal server error' },
				{ status: 500 }
			)
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
				store_id,
				stores (
					id,
					name,
					logo_url,
					slug,
					state,
					provinces ( name )
				)
			`
			)
			.eq('id', conversationId)
			.is('deleted_at', null)
			.single()

		if (error) throw error

		if (data.store_id) {
			const managedStoreIds = await getManagedStoreIds(user.id as string)
			if (managedStoreIds.includes(data.store_id as string)) {
				return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
			}
		}

		const store = (data as any).stores
			? {
					id: (data as any).stores.id,
					name: (data as any).stores.name,
					logoUrl: (data as any).stores.logo_url,
					slug: (data as any).stores.slug,
					state: (data as any).stores.state,
					provinceName: (data as any).stores.provinces?.name ?? null,
				}
			: null

		return NextResponse.json({
			data: {
				conversationId: (data as any).id,
				productId: (data as any).product_id,
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
