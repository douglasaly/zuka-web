'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import type { OrderStatus } from '@/lib/orders/status-transitions'
import { useSellerAccess } from '@/modules/seller/hooks/use-seller-access'
import type { PendingAction } from '@/modules/seller/ui/components/orders/types'
import { confirmCopy } from '@/modules/seller/ui/components/orders/utils'

export type SellerOrderDetail = {
	id: string
	status: OrderStatus
	statusLabel: string
	total: number
	currency: string
	itemCount: number
	createdAt: string
	completedAt: string | null
	reviewEligible: boolean
	reviewState: 'none' | 'awaiting' | 'done'
	notes: string | null
	buyer: {
		id: string | null
		name: string
		email: string | null
		phone: string | null
	}
	items: Array<{
		id: string
		quantity: number
		unitPrice: number
		currency: string
		productName: string
	}>
	timeline: Array<{
		status: OrderStatus
		label: string
		at: string
		note?: string
	}>
}

export function useSellerOrderDetail(id: string) {
	const queryClient = useQueryClient()
	const [pending, setPending] = useState<PendingAction | null>(null)
	const { can } = useSellerAccess()
	const canUpdateOrder = can('order.update')

	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ['seller-order', id],
		queryFn: async () => {
			const res = await fetch(`/api/seller/orders/${id}`)
			if (res.status === 404) return null
			if (!res.ok) {
				const json = await res.json().catch(() => ({}))
				throw new Error(json.error ?? 'Falha ao carregar')
			}
			const json = await res.json()
			return json.order as SellerOrderDetail
		},
	})

	const mutation = useMutation({
		mutationFn: async (action: PendingAction) => {
			const res = await fetch(`/api/seller/orders/${action.orderId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: action.nextStatus }),
			})
			const json = await res.json()
			if (!res.ok) throw new Error(json.error ?? 'Falha ao actualizar')
			return { action, order: json.order as SellerOrderDetail }
		},
		onSuccess: ({ action }) => {
			toast.success(confirmCopy(action).success)
			setPending(null)
			queryClient.invalidateQueries({ queryKey: ['seller-order', id] })
			queryClient.invalidateQueries({ queryKey: ['seller-orders'] })
			queryClient.invalidateQueries({ queryKey: ['unread-counts'] })
			queryClient.invalidateQueries({
				queryKey: ['seller-dashboard-orders'],
			})
		},
		onError: (error: Error, action) => {
			toast.error(error.message, {
				action: {
					label: 'Tentar novamente',
					onClick: () => mutation.mutate(action),
				},
			})
		},
	})

	const shortId = data?.id.slice(0, 8) ?? id.slice(0, 8)

	function requestStatus(nextStatus: PendingAction['nextStatus']) {
		if (!data) return
		setPending({
			orderId: data.id,
			shortId: data.id.slice(0, 8),
			nextStatus,
		})
	}

	return {
		data,
		isLoading,
		isError,
		refetch,
		pending,
		setPending,
		mutation,
		canUpdateOrder,
		shortId,
		requestStatus,
	}
}
