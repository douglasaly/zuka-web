'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export const STORE_DETAIL_TABS = [
	'Informações',
	'Produtos',
	'Atividade',
] as const
export type StoreDetailTab = (typeof STORE_DETAIL_TABS)[number]

async function fetchStore(id: string) {
	const res = await fetch(`/api/admin/stores/${id}`, {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function patchStore(id: string, body: Record<string, unknown>) {
	const res = await fetch(`/api/admin/stores/${id}`, {
		method: 'PATCH',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function deleteStore(id: string) {
	const res = await fetch(`/api/admin/stores/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
}

export function useStoreDetail(id: string) {
	const [tab, setTab] = useState<StoreDetailTab>('Informações')
	const [confirmAction, setConfirmAction] = useState<
		'delete' | 'suspend' | null
	>(null)
	const qc = useQueryClient()

	const { data, isLoading } = useQuery({
		queryKey: ['admin-store-detail', id],
		queryFn: () => fetchStore(id),
	})

	const patchMutation = useMutation({
		mutationFn: (body: Record<string, unknown>) => patchStore(id, body),
		onSuccess: () => {
			toast.success('Loja atualizada')
			qc.invalidateQueries({ queryKey: ['admin-store-detail', id] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const deleteMutation = useMutation({
		mutationFn: () => deleteStore(id),
		onSuccess: () => {
			toast.success('Loja eliminada')
			window.location.href = '/admin/stores'
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const store = data?.store as Record<string, unknown> | undefined
	const docs = (data?.docs ?? []) as Record<string, unknown>[]
	const products = (data?.products ?? []) as Record<string, unknown>[]
	const owner = store?.users as Record<string, unknown> | undefined
	const province = store?.provinces as Record<string, unknown> | undefined

	return {
		tab,
		setTab,
		confirmAction,
		setConfirmAction,
		isLoading,
		store,
		docs,
		products,
		owner,
		province,
		patchMutation,
		deleteMutation,
	}
}
