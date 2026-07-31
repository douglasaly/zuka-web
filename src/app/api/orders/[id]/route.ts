import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import {
	buildBuyerTimeline,
	mapBuyerOrder,
	mapBuyerOrderItem,
	pickProductImage,
} from '@/modules/orders/lib/map-buyer-order'
import type { BuyerOrderReview } from '@/modules/orders/types'

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = await params
		const supabase = createSupabaseAdmin()

		const { data, error } = await supabase
			.from('orders')
			.select(
				`
				*,
				stores(name, logo_url, slug),
				order_items(
					id,
					quantity,
					unit_price,
					currency,
					product_id,
					products(
						id,
						name,
						slug,
						product_images(url, is_primary, position, deleted_at)
					)
				)
			`
			)
			.eq('id', id)
			.eq('buyer_id', user.id as string)
			.is('deleted_at', null)
			.maybeSingle()

		if (error) throw error
		if (!data) {
			return NextResponse.json({ error: 'Not found' }, { status: 404 })
		}

		const row = data as Parameters<typeof mapBuyerOrder>[0] & {
			updated_at?: string | null
			completed_at?: string | null
			notes?: string | null
			order_items?: Parameters<typeof mapBuyerOrderItem>[0][]
		}

		const order = mapBuyerOrder(row)
		const items = (row.order_items ?? []).map(mapBuyerOrderItem)
		const timeline = buildBuyerTimeline({
			status: (data as { status: string }).status,
			created_at: row.created_at,
			updated_at: row.updated_at,
			completed_at: row.completed_at,
		})

		const review = await loadBuyerOrderReview({
			supabase,
			orderId: id,
			buyerId: user.id as string,
			items,
		})

		return NextResponse.json({
			success: true,
			order,
			items,
			timeline,
			notes: row.notes ?? null,
			review,
			storeSlug: order.storeSlug,
		})
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to load order' },
			{ status: 500 }
		)
	}
}

async function loadBuyerOrderReview({
	supabase,
	orderId,
	buyerId,
	items,
}: {
	supabase: ReturnType<typeof createSupabaseAdmin>
	orderId: string
	buyerId: string
	items: ReturnType<typeof mapBuyerOrderItem>[]
}): Promise<BuyerOrderReview | null> {
	const { data: reviewRow, error: reviewError } = await supabase
		.from('reviews')
		.select(
			`
			id,
			rating,
			body,
			created_at,
			store_reply,
			store_replied_at,
			review_products (
				product_id,
				rating,
				body,
				deleted_at,
				products (
					id,
					name,
					product_images ( url, is_primary, position, deleted_at )
				)
			)
		`
		)
		.eq('order_id', orderId)
		.eq('buyer_id', buyerId)
		.is('deleted_at', null)
		.maybeSingle()

	if (reviewError) throw reviewError
	if (!reviewRow) return null

	const productNameById = new Map(
		items
			.filter((item) => item.productId)
			.map((item) => [item.productId!, item.productName] as const)
	)
	const productImageById = new Map(
		items
			.filter((item) => item.productId)
			.map((item) => [item.productId!, item.imageUrl] as const)
	)

	const productRows = (
		(reviewRow.review_products ?? []) as Array<{
			product_id: string
			rating: number
			body: string | null
			deleted_at: string | null
			products: {
				id: string
				name: string
				product_images?: Array<{
					url: string
					is_primary: boolean | null
					position: number | null
					deleted_at?: string | null
				}> | null
			} | null
		}>
	).filter((row) => !row.deleted_at)

	return {
		id: reviewRow.id as string,
		rating: reviewRow.rating as number,
		body: (reviewRow.body as string | null) ?? null,
		createdAt: reviewRow.created_at as string,
		storeReply: (reviewRow.store_reply as string | null) ?? null,
		storeRepliedAt: (reviewRow.store_replied_at as string | null) ?? null,
		products: productRows.map((row) => ({
			productId: row.product_id,
			productName:
				row.products?.name ??
				productNameById.get(row.product_id) ??
				'Produto',
			imageUrl:
				pickProductImage(row.products?.product_images) ??
				productImageById.get(row.product_id) ??
				null,
			rating: row.rating,
			body: row.body,
		})),
	}
}
