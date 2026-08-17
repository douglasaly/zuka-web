import { DEFAULT_PER_PAGE, PER_PAGE_OPTIONS } from './constants'
import type { PendingAction } from './types'
export function formatOrderDate(iso: string) {
	return new Date(iso).toLocaleDateString('pt-PT', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
}
export function confirmCopy(action: PendingAction) {
	switch (action.nextStatus) {
		case 'SHIPPING':
			return {
				title: `Marcar pedido #${action.shortId} como em envio?`,
				description:
					'O cliente será notificado de que o pedido está a caminho. Depois poderá marcar como entregue.',
				confirmLabel: 'Confirmar envio',
				success: 'Pedido em envio. O cliente foi notificado.',
				destructive: false,
			}
		case 'COMPLETED':
			return {
				title: `Confirmar que o pedido #${action.shortId} foi entregue?`,
				description:
					'Esta acção não pode ser anulada. O cliente poderá avaliar a loja e os produtos.',
				confirmLabel: 'Marcar como entregue',
				success:
					'Pedido marcado como entregue. O cliente foi notificado.',
				destructive: false,
			}
		case 'CANCELLED':
			return {
				title: `Cancelar pedido #${action.shortId}?`,
				description:
					'O cliente será notificado. Pedidos cancelados não podem ser reactivados.',
				confirmLabel: 'Cancelar pedido',
				success: 'Pedido cancelado. O cliente foi notificado.',
				destructive: true,
			}
	}
}
export function buildPageList(
	current: number,
	totalPages: number
): Array<number | 'ellipsis'> {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1)
	}
	const pages = new Set<number>()
	pages.add(1)
	pages.add(totalPages)
	for (let p = current - 1; p <= current + 1; p++) {
		if (p >= 1 && p <= totalPages) pages.add(p)
	}
	const sorted = [...pages].sort((a, b) => a - b)
	const result: Array<number | 'ellipsis'> = []
	for (let i = 0; i < sorted.length; i++) {
		if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('ellipsis')
		result.push(sorted[i])
	}
	return result
}
export function parsePerPage(
	raw: string | null,
	options?: {
		defaultPerPage?: number
		perPageOptions?: readonly number[]
	}
): number {
	const defaultPerPage = options?.defaultPerPage ?? DEFAULT_PER_PAGE
	const perPageOptions = options?.perPageOptions ?? PER_PAGE_OPTIONS
	const n = Number(raw ?? defaultPerPage)
	return perPageOptions.includes(n) ? n : defaultPerPage
}
