import type { Database } from '@/lib/supabase/types'

export type OrderStatus = Database['public']['Enums']['order_status_enum']

/**
 * Linear seller flow: Pendente → Em envio → Entregue.
 * CONTACTED (legado/opcional) comporta-se como etapa pré-envio.
 * Cancelar interrompe o fluxo.
 */
export const ORDER_STATUS_TRANSITIONS: Record<
	OrderStatus,
	readonly OrderStatus[]
> = {
	PENDING: ['SHIPPING', 'CANCELLED'],
	CONTACTED: ['SHIPPING', 'CANCELLED'],
	SHIPPING: ['COMPLETED', 'CANCELLED'],
	COMPLETED: [],
	CANCELLED: [],
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	PENDING: 'Pendente',
	CONTACTED: 'Contactado',
	SHIPPING: 'Em envio',
	COMPLETED: 'Entregue',
	CANCELLED: 'Cancelado',
}

export function canTransition(
	from: OrderStatus,
	to: OrderStatus
): boolean {
	return ORDER_STATUS_TRANSITIONS[from].includes(to)
}

export function parseOrderStatus(value: string): OrderStatus | null {
	const upper = value.toUpperCase()
	if (
		upper === 'PENDING' ||
		upper === 'CONTACTED' ||
		upper === 'SHIPPING' ||
		upper === 'COMPLETED' ||
		upper === 'CANCELLED'
	) {
		return upper
	}
	return null
}

export function canMarkShipping(status: OrderStatus): boolean {
	return status === 'PENDING' || status === 'CONTACTED'
}

export function canMarkCompleted(status: OrderStatus): boolean {
	return status === 'SHIPPING'
}

export function canCancelOrder(status: OrderStatus): boolean {
	return (
		status === 'PENDING' ||
		status === 'CONTACTED' ||
		status === 'SHIPPING'
	)
}
