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
