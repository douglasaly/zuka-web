import './load-env'
import type { SupabaseClient } from '@supabase/supabase-js'
import { uuidv7 } from 'uuidv7'
import { createSupabaseAdmin } from '../lib/supabase/admin'

const STORE_ID = '019f1372-7b40-792f-b4bc-22c4b81f5717'
const STORE_COMMENTS = [
	'Entrega rápida e atendimento muito simpático.',
	'Boa comunicação pelo chat. Recomendo a loja.',
	'Chegou no prazo. Embalagem cuidada.',
	null,
	'Poderiam responder um pouco mais depressa, mas o resto correu bem.',
	'Excelente experiência do início ao fim.',
	null,
	'Atendimento correcto e produto conforme a descrição.',
]
const PRODUCT_COMMENTS = [
	'Qualidade boa pelo preço.',
	'Exactamente como na foto.',
	null,
	'Gostei bastante, vou comprar outra vez.',
	'Embalagem chegou um pouco amassada, produto ok.',
	null,
]
function daysAgo(days: number, hour = 16): string {
	const d = new Date()
	d.setUTCDate(d.getUTCDate() - days)
	d.setUTCHours(hour, (days * 11) % 60, 0, 0)
	return d.toISOString()
}
function pickRating(i: number): number {
	const cycle = [5, 4, 5, 3, 5, 4, 2, 5, 4, 5]
	return cycle[i % cycle.length]
}
async function seedReviews() {
	const supabase = createSupabaseAdmin() as unknown as SupabaseClient
	console.log(`🌱 Seeding reviews for store ${STORE_ID}…`)
	const { data: store, error: storeError } = await supabase
		.from('stores')
		.select('id, name')
		.eq('id', STORE_ID)
		.is('deleted_at', null)
		.maybeSingle()
	if (storeError) throw storeError
	if (!store) throw new Error(`Store not found: ${STORE_ID}`)
	const { data: completedOrders, error: ordersError } = await supabase
		.from('orders')
		.select(`
			id,
			buyer_id,
			store_id,
			completed_at,
			created_at,
			order_items ( id, product_id, products ( id, name ) )
		`)
		.eq('store_id', STORE_ID)
		.eq('status', 'COMPLETED')
		.is('deleted_at', null)
		.order('created_at', { ascending: false })
		.limit(40)
	if (ordersError) throw ordersError
	if (!completedOrders?.length) {
		throw new Error(
			'No COMPLETED orders found. Run yarn db:seed:orders first.'
		)
	}
	const orderIds = completedOrders.map((o) => o.id)
	const { data: existing } = await supabase
		.from('reviews')
		.select('order_id')
		.in('order_id', orderIds)
		.is('deleted_at', null)
	const alreadyReviewed = new Set((existing ?? []).map((r) => r.order_id))
	const candidates = completedOrders.filter((o) => !alreadyReviewed.has(o.id))
	if (candidates.length === 0) {
		console.log(
			'ℹ️  All completed orders already have reviews. Nothing to insert.'
		)
		return
	}
	const toReview = candidates.filter((_, i) => i % 3 !== 2)
	const reviewRows: Array<{
		id: string
		order_id: string
		buyer_id: string
		store_id: string
		rating: number
		body: string | null
		store_reply: string | null
		store_replied_at: string | null
		is_visible: boolean
		created_at: string
		updated_at: string
	}> = []
	const productRows: Array<{
		id: string
		review_id: string
		product_id: string
		rating: number
		body: string | null
		is_visible: boolean
		created_at: string
		updated_at: string
	}> = []
	const orderUpdates: string[] = []
	for (let i = 0; i < toReview.length; i++) {
		const order = toReview[i]
		const reviewId = uuidv7()
		const createdAt = order.completed_at
			? new Date(
					new Date(order.completed_at).getTime() +
						36e5 * (6 + (i % 20))
				).toISOString()
			: daysAgo(i + 1)
		const withReply = i % 4 === 1
		reviewRows.push({
			id: reviewId,
			order_id: order.id,
			buyer_id: order.buyer_id,
			store_id: STORE_ID,
			rating: pickRating(i),
			body: STORE_COMMENTS[i % STORE_COMMENTS.length],
			store_reply: withReply
				? 'Obrigado pelo feedback! Contamos consigo na próxima compra.'
				: null,
			store_replied_at: withReply
				? new Date(new Date(createdAt).getTime() + 864e5).toISOString()
				: null,
			is_visible: true,
			created_at: createdAt,
			updated_at: createdAt,
		})
		const items = (order.order_items ?? []) as unknown as Array<{
			product_id: string
			products: {
				id: string
				name: string
			} | null
		}>
		for (let p = 0; p < items.length; p++) {
			const item = items[p]
			if (!item?.product_id) continue
			productRows.push({
				id: uuidv7(),
				review_id: reviewId,
				product_id: item.product_id,
				rating: pickRating(i + p + 1),
				body: PRODUCT_COMMENTS[(i + p) % PRODUCT_COMMENTS.length],
				is_visible: true,
				created_at: createdAt,
				updated_at: createdAt,
			})
		}
		orderUpdates.push(order.id)
	}
	const { error: reviewsError } = await supabase
		.from('reviews')
		.insert(reviewRows)
	if (reviewsError) throw reviewsError
	if (productRows.length > 0) {
		const { error: productsError } = await supabase
			.from('review_products')
			.insert(productRows)
		if (productsError) {
			await supabase
				.from('reviews')
				.delete()
				.in(
					'id',
					reviewRows.map((r) => r.id)
				)
			throw productsError
		}
	}
	const { error: closeError } = await supabase
		.from('orders')
		.update({
			review_eligible: false,
			reviewed_at: new Date().toISOString(),
		})
		.in('id', orderUpdates)
	if (closeError) {
		console.warn(
			'⚠️  Could not update orders.reviewed_at:',
			closeError.message
		)
	}
	console.log(`✔️  Store: ${store.name}`)
	console.log(
		`✔️  Inserted ${reviewRows.length} store reviews, ${productRows.length} product reviews`
	)
	console.log(
		`✔️  Left ${candidates.length - toReview.length} completed orders without review (eligible)`
	)
	console.log('✨ Reviews seed completed')
}
seedReviews()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('❌ Reviews seed failed:', error)
		console.error(
			'   Tip: apply supabase/migrations/20260731075057_reviews_and_store_ratings.sql manually first.'
		)
		process.exit(1)
	})
