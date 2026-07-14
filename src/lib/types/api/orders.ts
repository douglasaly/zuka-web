// ─── Order routes ──────────────────────────────────────

export type OrderSummary = {
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

/** GET /api/orders */
export type ListOrdersOutput = {
	success: true
	orders: OrderSummary[]
}

/** GET /api/orders/[id] */
export type GetOrderOutput = {
	success: true
	order: OrderSummary
	storeSlug: string | null
	items: OrderItem[]
}
