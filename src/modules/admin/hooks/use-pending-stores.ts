'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export type StoreRow = Record<string, unknown>

async function fetchPending(): Promise<{ stores: StoreRow[] }> {
	const res = await fetch('/api/admin/stores?status=PENDING', {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function fetchStoreDetail(id: string) {
	const res = await fetch(`/api/admin/stores/${id}`, {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function updateStore(id: string, body: Record<string, unknown>) {
	const res = await fetch(`/api/admin/stores/${id}`, {
		method: 'PATCH',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

export function usePendingStores() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const reviewId = searchParams.get('review')

	const { data, isLoading } = useQuery({
		queryKey: ['admin-pending-stores-full'],
		queryFn: fetchPending,
	})

	const stores = data?.stores ?? []

	function openReview(id: string) {
		const params = new URLSearchParams(searchParams.toString())
		params.set('review', id)
		router.replace(`/admin/stores/pending?${params.toString()}`)
	}

	function closeReview() {
		router.replace('/admin/stores/pending')
	}

	return {
		stores,
		isLoading,
		reviewId,
		openReview,
		closeReview,
	}
}

export function useStoreReview(storeId: string, onClose: () => void) {
	const qc = useQueryClient()
	const [rejectionReason, setRejectionReason] = useState('')
	const [showReject, setShowReject] = useState(false)

	const { data, isLoading } = useQuery({
		queryKey: ['admin-store-detail', storeId],
		queryFn: () => fetchStoreDetail(storeId),
		enabled: Boolean(storeId),
	})

	const mutation = useMutation({
		mutationFn: ({ status, reason }: { status: string; reason?: string }) =>
			updateStore(storeId, { status, rejectionReason: reason }),
		onSuccess: (_, vars) => {
			toast.success(
				vars.status === 'ACTIVE'
					? 'Loja aprovada com sucesso'
					: 'Loja rejeitada'
			)
			qc.invalidateQueries({ queryKey: ['admin-pending-stores'] })
			qc.invalidateQueries({ queryKey: ['admin-stats'] })
			onClose()
		},
		onError: () => toast.error('Ocorreu um erro. Tenta novamente.'),
	})

	const store = data?.store as Record<string, unknown> | undefined
	const docs = (data?.docs ?? []) as Record<string, unknown>[]
	const owner = store?.users as Record<string, unknown> | undefined

	return {
		store,
		docs,
		owner,
		isLoading,
		rejectionReason,
		setRejectionReason,
		showReject,
		setShowReject,
		mutation,
	}
}
