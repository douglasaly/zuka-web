'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchOrder } from '@/lib/api/marketplace'
import type { BuyerOrder, BuyerOrderStatus } from '@/modules/orders/types'

function statusTone(status: BuyerOrderStatus) {
	switch (status) {
		case 'shipping':
			return {
				panel: 'from-sky-500/[0.08] to-transparent',
				ring: 'ring-sky-500/15',
			}
		case 'completed':
			return {
				panel: 'from-emerald-500/[0.08] to-transparent',
				ring: 'ring-emerald-500/15',
			}
		case 'cancelled':
			return {
				panel: 'from-muted to-transparent',
				ring: 'ring-border/60',
			}
		default:
			return {
				panel: 'from-amber-500/[0.1] to-transparent',
				ring: 'ring-amber-500/15',
			}
	}
}

function statusGuidance(
	order: BuyerOrder,
	hasStoreReply: boolean
): { headline: string; detail: string } {
	switch (order.status) {
		case 'pending':
			return {
				headline: 'A loja está a tratar do teu pedido',
				detail: 'Quando estiver pronto para envio, o estado actualiza-se aqui. Precisas de algo? Contacta a loja.',
			}
		case 'shipping':
			return {
				headline: 'O teu pedido está a caminho',
				detail: 'Se tiveres dúvidas sobre prazo ou local de entrega, contacta a loja.',
			}
		case 'completed':
			if (order.reviewEligible) {
				return {
					headline: 'Pedido entregue',
					detail: 'Avalia o atendimento da loja e os produtos nesta página.',
				}
			}
			if (hasStoreReply) {
				return {
					headline: 'Pedido entregue',
					detail: 'A loja respondeu à tua avaliação. Vê a resposta ao lado (ou mais abaixo no telemóvel).',
				}
			}
			return {
				headline: 'Pedido entregue',
				detail: 'A tua avaliação está nesta página. Se a loja responder, a mensagem aparece aqui.',
			}
		case 'cancelled':
			return {
				headline: 'Este pedido foi cancelado',
				detail: 'Já não segue para entrega. Se tiveres dúvidas, contacta a loja.',
			}
	}
}

function itemCountLabel(count: number) {
	if (count <= 0) return null
	return count === 1 ? '1 item' : `${count} itens`
}

export function useOrderDetail(id: string) {
	const queryClient = useQueryClient()
	const { data, isLoading, isError, refetch, isFetching } = useQuery({
		queryKey: ['order', id],
		queryFn: () => fetchOrder(id),
	})

	const order = data?.order
	const items = data?.items ?? []
	const timeline = data?.timeline ?? []
	const notes = data?.notes ?? null
	const review = data?.review ?? null

	const firstProductId = items[0]?.productId
	const guidance = order
		? statusGuidance(order, Boolean(review?.storeReply))
		: null
	const tone = order ? statusTone(order.status) : null
	const countLabel = order
		? itemCountLabel(order.itemCount || items.length)
		: null
	const canReview = Boolean(
		order && order.status === 'completed' && order.reviewEligible
	)
	const alreadyReviewed = Boolean(
		order &&
			order.status === 'completed' &&
			(!order.reviewEligible || Boolean(review))
	)
	const showBuyAgain = Boolean(
		order && order.status === 'completed' && firstProductId
	)
	const hasMobileActions =
		Boolean(order?.conversationId) ||
		Boolean(order?.storeSlug) ||
		showBuyAgain

	function onReviewSubmitted() {
		void queryClient.invalidateQueries({
			queryKey: ['order', id],
		})
		void queryClient.invalidateQueries({
			queryKey: ['orders'],
		})
	}

	return {
		data,
		isLoading,
		isError,
		refetch,
		isFetching,
		order,
		items,
		timeline,
		notes,
		review,
		firstProductId,
		guidance,
		tone,
		countLabel,
		canReview,
		alreadyReviewed,
		showBuyAgain,
		hasMobileActions,
		onReviewSubmitted,
	}
}
