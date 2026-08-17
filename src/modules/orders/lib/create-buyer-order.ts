import { uuidv7 } from 'uuidv7'
import { getManagedStoreIds } from '@/lib/auth/seller'
import type { createSupabaseAdmin } from '@/lib/supabase/admin'
import { MAX_CART_QUANTITY } from '@/modules/cart/types'
import {
	ensureBuyerStoreConversation,
	postConversationMessage,
} from '@/modules/orders/lib/ensure-buyer-store-conversation'
import { notifyOrderCreated } from '@/modules/orders/lib/notify-order-created'
import {
	formatOrderChatMessage,
	formatOrderWhatsAppMessage,
	type OrderLineCopy,
	orderShortId,
} from '@/modules/orders/lib/order-copy'
import type { CreatedBuyerOrder } from '@/modules/orders/types'

type Db = ReturnType<typeof createSupabaseAdmin>
export type CreateBuyerOrderInput = {
	buyerId: string
	storeId: string
	items: Array<{
		productId: string
		quantity: number
	}>
}
export type { CreatedBuyerOrder }
export type CreateBuyerOrderSuccess = {
	ok: true
} & CreatedBuyerOrder
export type CreateBuyerOrderFailure = {
	ok: false
	status: 400 | 403 | 404
	message: string
}
export type CreateBuyerOrderResult =
	| CreateBuyerOrderSuccess
	| CreateBuyerOrderFailure
function mergeQuantities(
	items: CreateBuyerOrderInput['items']
): Map<string, number> {
	const qtyByProduct = new Map<string, number>()
	for (const item of items) {
		const next = (qtyByProduct.get(item.productId) ?? 0) + item.quantity
		qtyByProduct.set(item.productId, Math.min(MAX_CART_QUANTITY, next))
	}
	return qtyByProduct
}
function unitPriceCents(product: {
	price: number
	discount_price: number | null
}) {
	if (
		product.discount_price != null &&
		product.discount_price > 0 &&
		product.discount_price < product.price
	) {
		return product.discount_price
	}
	return product.price
}
export async function createBuyerOrder(
	db: Db,
	input: CreateBuyerOrderInput
): Promise<CreateBuyerOrderResult> {
	const managedStoreIds = await getManagedStoreIds(input.buyerId)
	if (managedStoreIds.includes(input.storeId)) {
		return {
			ok: false,
			status: 403,
			message: 'Não podes fazer um pedido à tua própria loja.',
		}
	}
	const { data: store, error: storeError } = await db
		.from('stores')
		.select('id, name, owner_id, status, phone, whatsapp, deleted_at')
		.eq('id', input.storeId)
		.maybeSingle()
	if (storeError) throw storeError
	if (!store || store.deleted_at || store.status !== 'ACTIVE') {
		return {
			ok: false,
			status: 404,
			message: 'Loja não encontrada ou inactiva.',
		}
	}
	const qtyByProduct = mergeQuantities(input.items)
	const productIds = [...qtyByProduct.keys()]
	const { data: products, error: productsError } = await db
		.from('products')
		.select(
			'id, name, store_id, price, discount_price, currency, is_visible, deleted_at'
		)
		.in('id', productIds)
	if (productsError) throw productsError
	const productById = new Map((products ?? []).map((row) => [row.id, row]))
	const lines: Array<
		OrderLineCopy & {
			productId: string
		}
	> = []
	for (const productId of productIds) {
		const product = productById.get(productId)
		if (!product || product.deleted_at || !product.is_visible) {
			return {
				ok: false,
				status: 400,
				message:
					'Um produto do carrinho já não está à venda. Remove-o e tenta de novo.',
			}
		}
		if (product.store_id !== input.storeId) {
			return {
				ok: false,
				status: 400,
				message: 'Todos os produtos têm de ser da mesma loja.',
			}
		}
		const quantity = qtyByProduct.get(productId) ?? 0
		lines.push({
			productId,
			name: product.name,
			quantity,
			unitPriceCents: unitPriceCents(product),
			currency: product.currency ?? 'MZN',
		})
	}
	const currency = lines[0]?.currency ?? 'MZN'
	const totalCents = lines.reduce(
		(sum, line) => sum + line.unitPriceCents * line.quantity,
		0
	)
	const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
	const firstProductId = lines[0]?.productId
	if (!firstProductId) {
		return {
			ok: false,
			status: 400,
			message: 'O carrinho desta loja está vazio.',
		}
	}
	const conversationId = await ensureBuyerStoreConversation({
		db,
		buyerId: input.buyerId,
		storeId: store.id,
		storeOwnerId: store.owner_id,
		productId: firstProductId,
	})
	const orderId = uuidv7()
	const shortId = orderShortId(orderId)
	const now = new Date().toISOString()
	const { error: orderError } = await db.from('orders').insert({
		id: orderId,
		buyer_id: input.buyerId,
		store_id: store.id,
		status: 'PENDING',
		total: totalCents,
		currency,
		item_count: itemCount,
		conversation_id: conversationId,
		created_at: now,
		updated_at: now,
	})
	if (orderError) throw orderError
	const { error: itemsError } = await db.from('order_items').insert(
		lines.map((line) => ({
			id: uuidv7(),
			order_id: orderId,
			product_id: line.productId,
			quantity: line.quantity,
			unit_price: line.unitPriceCents,
			currency: line.currency,
			created_at: now,
		}))
	)
	if (itemsError) {
		await db.from('orders').delete().eq('id', orderId)
		throw itemsError
	}
	try {
		await postConversationMessage({
			db,
			conversationId,
			buyerId: input.buyerId,
			content: formatOrderChatMessage({
				shortId,
				lines,
				totalCents,
				currency,
			}),
		})
	} catch (error) {
		console.error('[createBuyerOrder] chat message', error)
	}
	try {
		await notifyOrderCreated({
			db,
			buyerId: input.buyerId,
			sellerId: store.owner_id,
			storeId: store.id,
			storeName: store.name,
			orderId,
			shortId,
		})
	} catch (error) {
		console.error('[createBuyerOrder] notifications', error)
	}
	const storePhone = store.whatsapp || store.phone || null
	return {
		ok: true,
		orderId,
		shortId,
		conversationId,
		storeName: store.name,
		storePhone,
		whatsappMessage: formatOrderWhatsAppMessage({
			shortId,
			storeName: store.name,
			lines,
			totalCents,
			currency,
		}),
	}
}
