'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export type StoreRow = Record<string, unknown>

export const STATUS_OPTIONS = [
	{ value: '', label: 'Todos' },
	{ value: 'ACTIVE', label: 'Aprovadas' },
	{ value: 'PENDING', label: 'Pendentes' },
	{ value: 'REJECTED', label: 'Rejeitadas' },
	{ value: 'SUSPENDED', label: 'Suspensas' },
]

async function fetchStores(search: string, status: string) {
	const params = new URLSearchParams()
	if (search) params.set('search', search)
	if (status) params.set('status', status)
	const res = await fetch(`/api/admin/stores?${params}`, {
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
	return res.json()
}

export function useAllStores() {
	const [search, setSearch] = useState('')
	const [status, setStatus] = useState('')
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
	const qc = useQueryClient()

	const { data, isLoading } = useQuery({
		queryKey: ['admin-all-stores', search, status],
		queryFn: () => fetchStores(search, status),
	})

	const patchMutation = useMutation({
		mutationFn: ({
			id,
			body,
		}: {
			id: string
			body: Record<string, unknown>
		}) => patchStore(id, body),
		onSuccess: () => {
			toast.success('Loja atualizada')
			qc.invalidateQueries({ queryKey: ['admin-all-stores'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteStore(id),
		onSuccess: () => {
			toast.success('Loja eliminada')
			setConfirmDelete(null)
			qc.invalidateQueries({ queryKey: ['admin-all-stores'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const stores: StoreRow[] = data?.stores ?? []

	function toggleSelect(id: string) {
		setSelected((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	function toggleSelectAll() {
		if (selected.size === stores.length) setSelected(new Set())
		else setSelected(new Set(stores.map((s) => s.id as string)))
	}

	return {
		search,
		setSearch,
		status,
		setStatus,
		selected,
		setSelected,
		confirmDelete,
		setConfirmDelete,
		stores,
		isLoading,
		patchMutation,
		deleteMutation,
		toggleSelect,
		toggleSelectAll,
	}
}
