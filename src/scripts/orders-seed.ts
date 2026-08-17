import './load-env'
import { uuidv7 } from 'uuidv7'
import { createSupabaseAdmin } from '../lib/supabase/admin'
import type { Database } from '../lib/supabase/types'

type OrderStatus = Database['public']['Enums']['order_status_enum']
const STORE_ID = '019f1372-7b40-792f-b4bc-22c4b81f5717'
const BUYER_IDS = [
	'019f2305-eca5-75bd-991a-b3056114d92d',
	'019f410d-56f6-7ebf-988a-4c9873d4e5c0',
	'019f4699-a020-7527-8a44-d8dac5bec4d4',
	'019f1ef4-5632-7a31-b83c-7002427f4bf5',
] as const
const PRODUCT_IDS = [
	'019f4aef-18c6-77b6-8394-ab78e34e74f9',
	'019f4ca6-9caf-7ab4-8552-48dd7ee04fb4',
	'019f4ca8-090c-7295-83de-30afce16e962',
	'019f4ca9-1fd5-7e93-89da-7e0359240a3a',
	'019f4caa-30ae-7bdb-b9c9-029d04a59030',
	'019f4caa-fea8-7268-8d22-e1981c3167ed',
] as const
const ORDER_COUNT = 20
const STATUS_CYCLE: OrderStatus[] = [
	'PENDING',
	'SHIPPING',
	'COMPLETED',
	'PENDING',
	'COMPLETED',
	'CANCELLED',
	'SHIPPING',
	'COMPLETED',
	'PENDING',
	'SHIPPING',
]
function unitPrice(product: {
	price: number
	discount_price: number | null
}): number {
	if (
		product.discount_price != null &&
		product.discount_price > 0 &&
		product.discount_price < product.price
	) {
		return product.discount_price
	}
	return product.price
}
function daysAgo(days: number, hourOffset = 10): string {
	const d = new Date()
	d.setUTCDate(d.getUTCDate() - days)
	d.setUTCHours(hourOffset, (days * 7) % 60, 0, 0)
	return d.toISOString()
}
async function seedOrders() {
	const supabase = createSupabaseAdmin()
	console.log(`🌱 Seeding ${ORDER_COUNT} orders for store ${STORE_ID}…`)
	const { data: store, error: storeError } = await supabase
		.from('stores')
		.select('id, name')
		.eq('id', STORE_ID)
		.is('deleted_at', null)
		.maybeSingle()
	if (storeError) throw storeError
	if (!store) {
		throw new Error(`Store not found: ${STORE_ID}`)
	}
	const { data: buyers, error: buyersError } = await supabase
		.from('users')
		.select('id')
		.in('id', [...BUYER_IDS])
	if (buyersError) throw buyersError
	if ((buyers?.length ?? 0) !== BUYER_IDS.length) {
		const found = new Set((buyers ?? []).map((b) => b.id))
		const missing = BUYER_IDS.filter((id) => !found.has(id))
		throw new Error(`Buyers missing: ${missing.join(', ')}`)
	}
	const { data: products, error: productsError } = await supabase
		.from('products')
		.select('id, name, price, discount_price, currency, store_id')
		.in('id', [...PRODUCT_IDS])
		.is('deleted_at', null)
	if (productsError) throw productsError
	if ((products?.length ?? 0) !== PRODUCT_IDS.length) {
		const found = new Set((products ?? []).map((p) => p.id))
		const missing = PRODUCT_IDS.filter((id) => !found.has(id))
		throw new Error(`Products missing: ${missing.join(', ')}`)
	}
	const wrongStore = products!.filter((p) => p.store_id !== STORE_ID)
	if (wrongStore.length > 0) {
		throw new Error(
			`Products not in store ${STORE_ID}: ${wrongStore.map((p) => p.id).join(', ')}`
		)
	}
	const productById = new Map(products!.map((p) => [p.id, p]))
	const orders: Array<{
		id: string
		buyer_id: string
		store_id: string
		status: OrderStatus
		total: number
		currency: string
		item_count: number
		created_at: string
		updated_at: string
		completed_at: string | null
		review_eligible: boolean
		notes: string | null
	}> = []
	const orderItems: Array<{
		id: string
		order_id: string
		product_id: string
		quantity: number
		unit_price: number
		currency: string
		created_at: string
	}> = []
	for (let i = 0; i < ORDER_COUNT; i++) {
		const orderId = uuidv7()
		const buyerId = BUYER_IDS[i % BUYER_IDS.length]
		const status = STATUS_CYCLE[i % STATUS_CYCLE.length]
		const createdAt = daysAgo(ORDER_COUNT - i, 9 + (i % 8))
		const lineCount = (i % 3) + 1
		const lines: Array<{
			productId: string
			quantity: number
			unit_price: number
			currency: string
		}> = []
		for (let l = 0; l < lineCount; l++) {
			const productId = PRODUCT_IDS[(i + l) % PRODUCT_IDS.length]
			const product = productById.get(productId)!
			const quantity = (i + l) % 3 === 0 ? 2 : 1
			lines.push({
				productId,
				quantity,
				unit_price: unitPrice(product),
				currency: product.currency ?? 'MZN',
			})
		}
		const total = lines.reduce(
			(sum, line) => sum + line.unit_price * line.quantity,
			0
		)
		const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
		const currency = lines[0]?.currency ?? 'MZN'
		const isCompleted = status === 'COMPLETED'
		orders.push({
			id: orderId,
			buyer_id: buyerId,
			store_id: STORE_ID,
			status,
			total,
			currency,
			item_count: itemCount,
			created_at: createdAt,
			updated_at: createdAt,
			completed_at: isCompleted
				? daysAgo(Math.max(0, ORDER_COUNT - i - 2), 15)
				: null,
			review_eligible: isCompleted,
			notes:
				status === 'CANCELLED'
					? 'Pedido de seed — cancelado para testes'
					: null,
		})
		for (const line of lines) {
			orderItems.push({
				id: uuidv7(),
				order_id: orderId,
				product_id: line.productId,
				quantity: line.quantity,
				unit_price: line.unit_price,
				currency: line.currency,
				created_at: createdAt,
			})
		}
	}
	const { error: ordersError } = await supabase.from('orders').insert(orders)
	if (ordersError) throw ordersError
	const { error: itemsError } = await supabase
		.from('order_items')
		.insert(orderItems)
	if (itemsError) {
		await supabase
			.from('orders')
			.delete()
			.in(
				'id',
				orders.map((o) => o.id)
			)
		throw itemsError
	}
	const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
		acc[o.status] = (acc[o.status] ?? 0) + 1
		return acc
	}, {})
	console.log(`✔️  Store: ${store.name}`)
	console.log(
		`✔️  Inserted ${orders.length} orders, ${orderItems.length} items`
	)
	console.log(`✔️  By status: ${JSON.stringify(byStatus)}`)
	console.log('✨ Orders seed completed')
}
seedOrders()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('❌ Orders seed failed:', error)
		process.exit(1)
	})
