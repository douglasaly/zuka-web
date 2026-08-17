import { uuidv7 } from 'uuidv7'
import type { createSupabaseAdmin } from '@/lib/supabase/admin'
import {
	buyerOrderPath,
	sellerOrderPath,
} from '@/modules/orders/lib/order-copy'

type Db = ReturnType<typeof createSupabaseAdmin>
export async function notifyOrderCreated(input: {
	db: Db
	buyerId: string
	sellerId: string
	storeId: string
	storeName: string
	orderId: string
	shortId: string
}) {
	const { db, buyerId, sellerId, storeId, storeName, orderId, shortId } =
		input
	const rows = [
		{
			id: uuidv7(),
			user_id: buyerId,
			type: 'order' as const,
			title: `Pedido #${shortId} criado`,
			body: `A loja ${storeName} recebeu o teu pedido.`,
			link: buyerOrderPath(orderId),
			sender_store_id: storeId,
		},
		{
			id: uuidv7(),
			user_id: sellerId,
			type: 'order' as const,
			title: `Novo pedido #${shortId}`,
			body: `Um comprador fez um pedido na ${storeName}.`,
			link: sellerOrderPath(orderId),
			sender_store_id: storeId,
		},
	]
	const { error } = await db.from('notifications').insert(rows)
	if (error) {
		console.error('[notifyOrderCreated]', error)
	}
}
