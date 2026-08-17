'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCart } from '@/hooks/use-cart'
import { createBuyerOrder } from '@/lib/api/marketplace'
import type { CreatedBuyerOrder } from '@/modules/orders/types'

type UseCreateOrderOptions = {
	onCreated?: (order: CreatedBuyerOrder, storeId: string) => void
}
export function useCreateOrder(options?: UseCreateOrderOptions) {
	const queryClient = useQueryClient()
	const { clearCart } = useCart()
	return useMutation({
		mutationFn: createBuyerOrder,
		onSuccess: (order, input) => {
			options?.onCreated?.(order, input.storeId)
			clearCart(input.storeId)
			void queryClient.invalidateQueries({ queryKey: ['orders'] })
			void queryClient.invalidateQueries({
				queryKey: ['notifications'],
			})
			void queryClient.invalidateQueries({ queryKey: ['inbox'] })
			void queryClient.invalidateQueries({
				queryKey: ['unread-counts'],
			})
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: 'Não foi possível criar o pedido. Tenta de novo.'
			)
		},
	})
}
