import { type NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

/** Reviews tables exist after manual migration; generated Database types may lag. */
function db(): SupabaseClient {
	return createSupabaseAdmin() as unknown as SupabaseClient
}

type Scope = 'all' | 'store' | 'product'

function buyerName(
	row: {
		first_name: string | null
		last_name: string | null
	} | null
): string {
	if (!row) return 'Cliente'
	const name = [row.first_name, row.last_name]
		.filter(Boolean)
		.join(' ')
		.trim()
	return name || 'Cliente'
}

function distributionFromRatings(ratings: number[]): number[] {
	const dist = [0, 0, 0, 0, 0]
	for (const r of ratings) {
		const star = Math.round(r)
		if (star >= 1 && star <= 5) dist[star - 1]++
	}
	return dist
}

export async function GET(request: NextRequest) {
	try {
		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error
		const { store } = auth

		const { searchParams } = new URL(request.url)
		const scope = (searchParams.get('scope') ?? 'all') as Scope
		const search = (searchParams.get('search') ?? '').trim().toLowerCase()
		const needsReply = searchParams.get('needsReply') === '1'

		const supabase = db()

		const { data: storeRatingRow } = await supabase
			.from('store_ratings')
			.select('rating_avg, rating_count')
			.eq('store_id', store.id)
			.maybeSingle()

		const { data: reviews, error } = await supabase
			.from('reviews')
			.select(
				`
				id,
				order_id,
				rating,
				body,
				store_reply,
				store_replied_at,
				created_at,
				users!reviews_buyer_id_fkey ( first_name, last_name ),
				review_products (
					id,
					product_id,
					rating,
					body,
					created_at,
					products ( id, name, product_images ( url, is_primary, position ) )
				)
			`
			)
			.eq('store_id', store.id)
			.is('deleted_at', null)
			.eq('is_visible', true)
			.order('created_at', { ascending: false })
			.limit(100)

		if (error) throw error

		const storeReviews = ((reviews ?? []) as Array<Record<string, unknown>>).map(
			(row) => {
				const buyer = row.users as {
					first_name: string | null
					last_name: string | null
				} | null

				const products = (
					(row.review_products as Array<Record<string, unknown>> | null) ??
					[]
				).map((rp) => {
					const product = rp.products as {
						id: string
						name: string
						product_images: Array<{
							url: string
							is_primary?: boolean
							position?: number
						}> | null
					} | null
					const images = [...(product?.product_images ?? [])].sort(
						(a, b) => (a.position ?? 0) - (b.position ?? 0)
					)
					const primary =
						images.find((img) => img.is_primary) ?? images[0] ?? null

					return {
						id: rp.id as string,
						productId: rp.product_id as string,
						productName: product?.name ?? 'Produto',
						productImage: primary?.url ?? null,
						rating: rp.rating as number,
						body: (rp.body as string | null) ?? null,
						createdAt: rp.created_at as string,
					}
				})

				return {
					id: row.id as string,
					orderId: row.order_id as string,
					shortOrderId: String(row.order_id).slice(0, 8),
					buyerName: buyerName(buyer),
					rating: row.rating as number,
					body: (row.body as string | null) ?? null,
					storeReply: (row.store_reply as string | null) ?? null,
					storeRepliedAt: (row.store_replied_at as string | null) ?? null,
					createdAt: row.created_at as string,
					products,
				}
			}
		)

		let filteredStore = storeReviews
		if (needsReply) {
			filteredStore = filteredStore.filter((r) => !r.storeReply)
		}
		if (search) {
			filteredStore = filteredStore.filter(
				(r) =>
					r.buyerName.toLowerCase().includes(search) ||
					r.shortOrderId.toLowerCase().includes(search) ||
					(r.body?.toLowerCase().includes(search) ?? false) ||
					r.products.some((p) =>
						p.productName.toLowerCase().includes(search)
					)
			)
		}

		const productReviews = filteredStore.flatMap((r) =>
			r.products.map((p) => ({
				id: p.id,
				reviewId: r.id,
				orderId: r.orderId,
				shortOrderId: r.shortOrderId,
				buyerName: r.buyerName,
				productId: p.productId,
				productName: p.productName,
				productImage: p.productImage,
				rating: p.rating,
				body: p.body,
				createdAt: p.createdAt,
				storeReply: r.storeReply,
			}))
		)

		const storeRatingsList = storeReviews.map((r) => r.rating)
		const productRatingsList = storeReviews.flatMap((r) =>
			r.products.map((p) => p.rating)
		)

		const productAvg =
			productRatingsList.length > 0
				? productRatingsList.reduce((a, b) => a + b, 0) /
					productRatingsList.length
				: 0

		const ratingRow = storeRatingRow as {
			rating_avg?: number
			rating_count?: number
		} | null

		return NextResponse.json({
			success: true,
			summary: {
				store: {
					average: Number(
						ratingRow?.rating_avg ??
							(storeRatingsList.length
								? (
										storeRatingsList.reduce((a, b) => a + b, 0) /
										storeRatingsList.length
									).toFixed(2)
								: 0)
					),
					count: ratingRow?.rating_count ?? storeRatingsList.length,
					distribution: distributionFromRatings(storeRatingsList),
				},
				products: {
					average: Number(productAvg.toFixed(2)),
					count: productRatingsList.length,
					distribution: distributionFromRatings(productRatingsList),
				},
			},
			storeReviews: scope === 'product' ? [] : filteredStore,
			productReviews: scope === 'store' ? [] : productReviews,
		})
	} catch (error) {
		console.error('[GET /api/seller/reviews]', error)
		return NextResponse.json(
			{ error: 'Não foi possível carregar as avaliações' },
			{ status: 500 }
		)
	}
}
