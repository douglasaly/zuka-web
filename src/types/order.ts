import type { OrderStatus } from '@/lib/orders/status-transitions'

export interface OrderSummary {
	id: string
	storeName: string
	storeAvatar: string | null
	date: string
	itemCount: number
	total: number
	currency: string
	status: 'shipping' | 'pending' | 'completed' | 'cancelled'
	statusLabel: string
}

export type OrderItem = {
	id: string
	quantity: number
	unitPrice: number
	currency: string
	productName: string
	productSlug: string
}
export type ListOrdersOutput = {
	success: true
	orders: OrderSummary[]
}
export type GetOrderOutput = {
	success: true
	order: OrderSummary
	storeSlug: string | null
	items: OrderItem[]
}

export type BuyerOrderStatus =
	| 'pending'
	| 'shipping'
	| 'completed'
	| 'cancelled'
export type BuyerOrderItem = {
	id: string
	productId: string | null
	productName: string
	quantity: number
	unitPrice: number
	currency: string
	imageUrl: string | null
}
export type BuyerOrder = {
	id: string
	shortId: string
	storeName: string
	storeAvatar: string | null
	storeSlug: string | null
	date: string
	createdAt: string
	itemCount: number
	total: number
	currency: string
	status: BuyerOrderStatus
	statusLabel: string
	reviewEligible: boolean
	conversationId: string | null
	itemsPreview: BuyerOrderItem[]
}
export type BuyerOrderTimelineStep = {
	status: string
	label: string
	at: string | null
	state: 'done' | 'current' | 'upcoming'
}
export type BuyerOrderProductReview = {
	productId: string
	productName: string
	imageUrl: string | null
	rating: number
	body: string | null
}
export type BuyerOrderReview = {
	id: string
	rating: number
	body: string | null
	createdAt: string
	storeReply: string | null
	storeRepliedAt: string | null
	products: BuyerOrderProductReview[]
}
export type BuyerOrderDetail = {
	order: BuyerOrder
	items: BuyerOrderItem[]
	timeline: BuyerOrderTimelineStep[]
	notes: string | null
	review: BuyerOrderReview | null
}
export type StatusFilter =
	| 'all'
	| 'pending'
	| 'shipping'
	| 'completed'
	| 'cancelled'
export type PeriodFilter = 'all' | '7' | '30' | '90'
export type CreatedBuyerOrder = {
	orderId: string
	shortId: string
	conversationId: string
	storeName: string
	storePhone: string | null
	whatsappMessage: string
}

export type OrderSheetPendingAction = {
	orderId: string
	shortId: string
	nextStatus: Extract<OrderStatus, 'SHIPPING' | 'COMPLETED' | 'CANCELLED'>
}
export type PendingAction = OrderSheetPendingAction
