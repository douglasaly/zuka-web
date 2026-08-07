import { type NextRequest, NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

const CONTACT_TYPES = new Set(['whatsapp', 'call'])
const CONTACT_SOURCES = new Set(['product', 'store'])

type ContactEventBody = {
	storeId?: unknown
	productId?: unknown
	type?: unknown
	source?: unknown
}

export async function POST(request: NextRequest) {
	try {
		let body: ContactEventBody
		try {
			body = await request.json()
		} catch {
			return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
		}

		const storeId = typeof body.storeId === 'string' ? body.storeId : null
		const productId =
			typeof body.productId === 'string' && body.productId.length > 0
				? body.productId
				: null
		const type = typeof body.type === 'string' ? body.type : null
		const source = typeof body.source === 'string' ? body.source : null

		if (!storeId || !type || !source) {
			return NextResponse.json(
				{ error: 'storeId, type and source are required' },
				{ status: 400 }
			)
		}

		if (!CONTACT_TYPES.has(type)) {
			return NextResponse.json(
				{ error: 'type must be whatsapp or call' },
				{ status: 400 }
			)
		}

		if (!CONTACT_SOURCES.has(source)) {
			return NextResponse.json(
				{ error: 'source must be product or store' },
				{ status: 400 }
			)
		}

		if (source === 'product' && !productId) {
			return NextResponse.json(
				{ error: 'productId is required when source is product' },
				{ status: 400 }
			)
		}

		const supabase = createSupabaseAdmin()

		const { data: store } = await supabase
			.from('stores')
			.select('id')
			.eq('id', storeId)
			.eq('status', 'ACTIVE')
			.is('deleted_at', null)
			.maybeSingle()

		if (!store) {
			return NextResponse.json(
				{ error: 'Store not found' },
				{ status: 404 }
			)
		}

		if (productId) {
			const { data: product } = await supabase
				.from('products')
				.select('id, store_id')
				.eq('id', productId)
				.is('deleted_at', null)
				.maybeSingle()

			if (!product || product.store_id !== storeId) {
				return NextResponse.json(
					{ error: 'Product not found for this store' },
					{ status: 404 }
				)
			}
		}

		let userId: string | null = null
		try {
			const user = await getSessionUser()
			userId = user?.id ?? null
		} catch {
			// Best-effort: invalid/expired session must not block anonymous tracking
		}

		const { error } = await supabase.from('store_contact_events').insert({
			id: uuidv7(),
			store_id: storeId,
			product_id: productId,
			type: type as 'whatsapp' | 'call',
			source,
			user_id: userId,
		})

		if (error) {
			console.error('[POST /api/contact-events]', error)
			return NextResponse.json(
				{ error: 'Failed to record contact event' },
				{ status: 500 }
			)
		}

		return NextResponse.json({ ok: true }, { status: 201 })
	} catch (err) {
		console.error('[POST /api/contact-events]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
