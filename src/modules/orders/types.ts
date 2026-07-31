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

export type BuyerOrderDetail = {
	order: BuyerOrder
	items: BuyerOrderItem[]
	timeline: BuyerOrderTimelineStep[]
	notes: string | null
	review: BuyerOrderReview | null
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

export const STATUS_FILTERS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'pending', label: 'Em processamento' },
	{ value: 'shipping', label: 'Em envio' },
	{ value: 'completed', label: 'Entregue' },
	{ value: 'cancelled', label: 'Cancelado' },
] as const

export const PERIOD_FILTERS = [
	{ value: 'all', label: 'Todo o período' },
	{ value: '7', label: 'Últimos 7 dias' },
	{ value: '30', label: 'Últimos 30 dias' },
	{ value: '90', label: 'Últimos 90 dias' },
] as const

export type StatusFilter = (typeof STATUS_FILTERS)[number]['value']
export type PeriodFilter = (typeof PERIOD_FILTERS)[number]['value']
