import type { OrderStatus } from '@/lib/orders/status-transitions'
import type { OrderSheetPendingAction } from '../seller-order-detail-sheet'
export type ReviewState = 'none' | 'awaiting' | 'done'
export type SellerOrder = {
	id: string
	shortId: string
	customerName: string
	customerEmail: string | null
	itemsSummary: string
	itemCount: number
	total: number
	currency: string
	status: OrderStatus
	statusLabel: string
	date: string
	reviewEligible: boolean
	reviewState: ReviewState
	allowedActions: {
		markShipping: boolean
		markCompleted: boolean
		cancel: boolean
	}
}
export type OrdersResponse = {
	orders: SellerOrder[]
	total: number
	page: number
	perPage: number
	totalPages: number
	hasMore: boolean
}
export type PendingAction = OrderSheetPendingAction
