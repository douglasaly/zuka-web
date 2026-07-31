import { ORDER_STATUS_LABELS } from '@/lib/orders/status-transitions'
import type {
	BuyerOrder,
	BuyerOrderItem,
	BuyerOrderStatus,
	BuyerOrderTimelineStep,
} from '@/modules/orders/types'
import { formatLongPtDate, formatLongPtDateTime } from '@/utils/format-date'

type ProductImage = {
	url: string
	is_primary: boolean | null
	position: number | null
	deleted_at?: string | null
}

type ProductRow = {
	id: string
	name: string
	slug: string | null
	product_images?: ProductImage[] | null
}

type OrderItemRow = {
	id: string
	quantity: number
	unit_price: number
	currency: string
	product_id?: string
	products: ProductRow | null
}

const statusMap: Record<
	string,
	{ status: BuyerOrderStatus; label: string }
> = {
	PENDING: { status: 'pending', label: 'Em processamento' },
	CONTACTED: { status: 'pending', label: 'Em processamento' },
	SHIPPING: { status: 'shipping', label: ORDER_STATUS_LABELS.SHIPPING },
	COMPLETED: { status: 'completed', label: ORDER_STATUS_LABELS.COMPLETED },
	CANCELLED: { status: 'cancelled', label: ORDER_STATUS_LABELS.CANCELLED },
}

export function formatBuyerOrderDate(iso: string): string {
	return formatLongPtDate(iso)
}

export function pickProductImage(
	images: ProductImage[] | null | undefined
): string | null {
	const active = (images ?? []).filter((img) => !img.deleted_at)
	if (active.length === 0) return null
	const primary = active.find((img) => img.is_primary)
	if (primary) return primary.url
	const sorted = [...active].sort(
		(a, b) => (a.position ?? 0) - (b.position ?? 0)
	)
	return sorted[0]?.url ?? null
}

export function mapBuyerOrderItem(row: OrderItemRow): BuyerOrderItem {
	return {
		id: row.id,
		productId: row.products?.id ?? row.product_id ?? null,
		productName: row.products?.name ?? 'Produto',
		quantity: row.quantity,
		unitPrice: row.unit_price / 100,
		currency: row.currency,
		imageUrl: pickProductImage(row.products?.product_images),
	}
}

export function mapBuyerOrder(row: {
	id: string
	total: number
	currency: string
	item_count: number
	status: string
	created_at: string
	review_eligible?: boolean | null
	conversation_id?: string | null
	stores?: {
		name: string
		logo_url?: string | null
		slug?: string | null
	} | null
	order_items?: OrderItemRow[] | null
}): BuyerOrder {
	const mapped =
		statusMap[row.status as keyof typeof statusMap] ?? statusMap.PENDING
	const items = (row.order_items ?? []).map(mapBuyerOrderItem)

	return {
		id: row.id,
		shortId: row.id.slice(0, 8).toUpperCase(),
		storeName: row.stores?.name ?? 'Loja',
		storeAvatar: row.stores?.logo_url ?? null,
		storeSlug: row.stores?.slug ?? null,
		date: formatBuyerOrderDate(row.created_at),
		createdAt: row.created_at,
		itemCount: row.item_count,
		total: row.total / 100,
		currency: row.currency,
		status: mapped.status,
		statusLabel: mapped.label,
		reviewEligible: Boolean(row.review_eligible),
		conversationId: row.conversation_id ?? null,
		itemsPreview: items.slice(0, 3),
	}
}

export function buildBuyerTimeline(row: {
	status: string
	created_at: string
	updated_at?: string | null
	completed_at?: string | null
}): BuyerOrderTimelineStep[] {
	const createdAt = row.created_at
	const updatedAt = row.updated_at ?? createdAt
	const completedAt = row.completed_at ?? updatedAt
	const status = row.status

	if (status === 'CANCELLED') {
		return [
			{
				status: 'PENDING',
				label: 'Pedido feito',
				at: createdAt,
				state: 'done',
			},
			{
				status: 'CANCELLED',
				label: 'Cancelado',
				at: updatedAt,
				state: 'current',
			},
		]
	}

	return [
		{
			status: 'PENDING',
			label: 'Pedido feito',
			at: createdAt,
			state: 'done',
		},
		{
			status: 'PROCESSING',
			label: 'Em processamento',
			at:
				status === 'PENDING' || status === 'CONTACTED'
					? updatedAt
					: createdAt,
			state:
				status === 'PENDING' || status === 'CONTACTED'
					? 'current'
					: 'done',
		},
		{
			status: 'SHIPPING',
			label: 'Em envio',
			at:
				status === 'SHIPPING' || status === 'COMPLETED'
					? updatedAt
					: null,
			state:
				status === 'SHIPPING'
					? 'current'
					: status === 'COMPLETED'
						? 'done'
						: 'upcoming',
		},
		{
			status: 'COMPLETED',
			label: 'Entregue',
			at: status === 'COMPLETED' ? completedAt : null,
			state: status === 'COMPLETED' ? 'current' : 'upcoming',
		},
	]
}

export function formatTimelineAt(iso: string | null): string | null {
	if (!iso) return null
	return formatLongPtDateTime(iso)
}
