import type { SupabaseClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

function db(): SupabaseClient {
	return createSupabaseAdmin() as unknown as SupabaseClient
}
type Sort = 'recent' | 'highest' | 'lowest'
function buyerDisplayName(
	row: {
		first_name: string | null
		last_name: string | null
	} | null
): string {
	if (!row) return 'Cliente'
	const first = (row.first_name ?? '').trim()
	const last = (row.last_name ?? '').trim()
	if (first && last) return `${first} ${last.charAt(0).toUpperCase()}.`
	if (first) return first
	if (last) return last
	return 'Cliente'
}
function distributionFromRatings(ratings: number[]): number[] {
	const dist = [0, 0, 0, 0, 0]
	for (const r of ratings) {
		const star = Math.round(r)
		if (star >= 1 && star <= 5) dist[star - 1]++
	}
	return dist
}
function primaryImageUrl(
	images: Array<{
		url: string
		is_primary?: boolean
		position?: number
	}> | null
): string | null {
	if (!images?.length) return null
	const sorted = [...images].sort(
		(a, b) => (a.position ?? 0) - (b.position ?? 0)
	)
	return (sorted.find((i) => i.is_primary) ?? sorted[0])?.url ?? null
}
export async function GET(
	request: NextRequest,
	{
		params,
	}: {
		params: Promise<{
			id: string
		}>
	}
) {
	try {
		const { id: productId } = await params
		if (!productId) {
			return NextResponse.json(
				{ error: 'ID do produto em falta.' },
				{ status: 400 }
			)
		}
		const { searchParams } = new URL(request.url)
		const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1)
		const perPageRaw = Number(searchParams.get('perPage') ?? 10) || 10
		const perPage = [10, 25, 50].includes(perPageRaw) ? perPageRaw : 10
		const ratingFilter = searchParams.get('rating')
		const rating =
			ratingFilter && ['1', '2', '3', '4', '5'].includes(ratingFilter)
				? Number(ratingFilter)
				: null
		const sort = (searchParams.get('sort') ?? 'recent') as Sort
		const search = (searchParams.get('search') ?? '').trim()
		const summaryOnly = searchParams.get('summaryOnly') === '1'
		const supabase = db()
		const { data: product, error: productError } = await supabase
			.from('products')
			.select(`
				id,
				name,
				price,
				discount_price,
				currency,
				store_id,
				categories ( name ),
				product_images ( url, is_primary, position ),
				stores!inner (
					id,
					name,
					slug,
					logo_url,
					verified_at,
					status
				)
			`)
			.eq('id', productId)
			.eq('is_visible', true)
			.is('deleted_at', null)
			.eq('stores.status', 'ACTIVE')
			.maybeSingle()
		if (productError) throw productError
		if (!product) {
			return NextResponse.json(
				{ error: 'Produto não encontrado' },
				{ status: 404 }
			)
		}
		const productRow = product as Record<string, unknown>
		const store = productRow.stores as {
			id: string
			name: string
			slug: string
			logo_url: string | null
			verified_at: string | null
		} | null
		const category = productRow.categories as {
			name: string
		} | null
		const images = productRow.product_images as Array<{
			url: string
			is_primary?: boolean
			position?: number
		}> | null
		const [
			{ data: productRating },
			{ data: storeRating },
			{ data: allRatingsRows },
		] = await Promise.all([
			supabase
				.from('product_ratings')
				.select('rating_avg, rating_count')
				.eq('product_id', productId)
				.maybeSingle(),
			store?.id
				? supabase
						.from('store_ratings')
						.select('rating_avg, rating_count')
						.eq('store_id', store.id)
						.maybeSingle()
				: Promise.resolve({ data: null }),
			supabase
				.from('review_products')
				.select('rating, reviews!inner(is_visible, deleted_at)')
				.eq('product_id', productId)
				.eq('is_visible', true)
				.is('deleted_at', null)
				.eq('reviews.is_visible', true)
				.is('reviews.deleted_at', null),
		])
		const allRatings = (
			(allRatingsRows ?? []) as Array<{
				rating: number
			}>
		).map((r) => r.rating)
		const productRatingRow = productRating as {
			rating_avg?: number
			rating_count?: number
		} | null
		const storeRatingRow = storeRating as {
			rating_avg?: number
			rating_count?: number
		} | null
		const summary = {
			average: Number(
				productRatingRow?.rating_avg ??
					(allRatings.length
						? (
								allRatings.reduce((a, b) => a + b, 0) /
								allRatings.length
							).toFixed(2)
						: 0)
			),
			count: productRatingRow?.rating_count ?? allRatings.length,
			distribution: distributionFromRatings(allRatings),
		}
		const productPayload = {
			id: productRow.id as string,
			name: productRow.name as string,
			price: Number(productRow.price) / 100,
			discountPrice:
				productRow.discount_price != null
					? Number(productRow.discount_price) / 100
					: null,
			currency: (productRow.currency as string) ?? 'MZN',
			image: primaryImageUrl(images),
			categoryName: category?.name ?? null,
		}
		const storePayload = store
			? {
					id: store.id,
					name: store.name,
					slug: store.slug,
					avatarUrl: store.logo_url,
					verified: Boolean(store.verified_at),
					rating: storeRatingRow?.rating_avg
						? Number(storeRatingRow.rating_avg)
						: null,
					reviewCount: storeRatingRow?.rating_count ?? 0,
				}
			: null
		if (summaryOnly) {
			return NextResponse.json({
				success: true,
				product: productPayload,
				store: storePayload,
				summary,
				reviews: [],
				page: 1,
				perPage: 0,
				total: summary.count,
				totalPages: 1,
				hasMore: false,
			})
		}
		let query = supabase
			.from('review_products')
			.select(
				`
				id,
				rating,
				body,
				created_at,
				reviews!inner (
					id,
					order_id,
					store_reply,
					store_replied_at,
					is_visible,
					deleted_at,
					users!reviews_buyer_id_fkey ( first_name, last_name )
				)
			`,
				{ count: 'exact' }
			)
			.eq('product_id', productId)
			.eq('is_visible', true)
			.is('deleted_at', null)
			.eq('reviews.is_visible', true)
			.is('reviews.deleted_at', null)
		if (rating != null) {
			query = query.eq('rating', rating)
		}
		if (search) {
			query = query.ilike('body', `%${search}%`)
		}
		if (sort === 'highest') {
			query = query
				.order('rating', { ascending: false })
				.order('created_at', { ascending: false })
		} else if (sort === 'lowest') {
			query = query
				.order('rating', { ascending: true })
				.order('created_at', { ascending: false })
		} else {
			query = query.order('created_at', { ascending: false })
		}
		const from = (page - 1) * perPage
		const to = from + perPage - 1
		const {
			data: rows,
			error: listError,
			count,
		} = await query.range(from, to)
		if (listError) throw listError
		const reviews = ((rows ?? []) as Array<Record<string, unknown>>).map(
			(row) => {
				const parent = row.reviews as {
					id: string
					order_id: string
					store_reply: string | null
					store_replied_at: string | null
					users: {
						first_name: string | null
						last_name: string | null
					} | null
				}
				return {
					id: row.id as string,
					reviewId: parent.id,
					orderId: parent.order_id,
					shortOrderId: String(parent.order_id).slice(0, 8),
					buyerName: buyerDisplayName(parent.users),
					rating: row.rating as number,
					body: (row.body as string | null) ?? null,
					createdAt: row.created_at as string,
					storeReply: parent.store_reply,
					storeRepliedAt: parent.store_replied_at,
				}
			}
		)
		const totalFromDb = count ?? 0
		const totalPages = Math.max(1, Math.ceil(totalFromDb / perPage) || 1)
		return NextResponse.json({
			success: true,
			product: productPayload,
			store: storePayload,
			summary,
			reviews,
			page,
			perPage,
			total: totalFromDb,
			totalPages,
			hasMore: page < totalPages,
		})
	} catch (error) {
		console.error('[GET /api/products/:id/reviews]', error)
		return NextResponse.json(
			{ error: 'Não foi possível carregar as avaliações' },
			{ status: 500 }
		)
	}
}
