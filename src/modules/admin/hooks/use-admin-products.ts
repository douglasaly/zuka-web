'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDeferredValue, useState } from 'react'
import { toast } from 'sonner'
import type { AdminProduct } from '@/modules/admin/ui/components/products/constants'

async function fetchProducts(search: string, status: string) {
	const params = new URLSearchParams()
	if (search) params.set('search', search)
	if (status !== 'all') params.set('status', status)
	const res = await fetch(`/api/admin/products?${params}`, {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}
async function patchProduct(id: string, body: Record<string, unknown>) {
	const res = await fetch(`/api/admin/products/${id}`, {
		method: 'PATCH',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}
async function deleteProduct(id: string) {
	const res = await fetch(`/api/admin/products/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
}
export function useAdminProducts() {
	const [search, setSearch] = useState('')
	const [status, setStatus] = useState('all')
	const deferredSearch = useDeferredValue(search.trim())
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
	const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
	const [preview, setPreview] = useState<AdminProduct | null>(null)
	const qc = useQueryClient()
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['admin-products', deferredSearch, status],
		queryFn: () => fetchProducts(deferredSearch, status),
	})
	const patchMutation = useMutation({
		mutationFn: ({
			id,
			body,
		}: {
			id: string
			body: Record<string, unknown>
		}) => patchProduct(id, body),
		onSuccess: (_, vars) => {
			toast.success(
				vars.body.is_visible === false
					? 'Produto pausado'
					: 'Produto reativado'
			)
			qc.invalidateQueries({ queryKey: ['admin-products'] })
			if (preview?.id === vars.id) {
				setPreview((prev) =>
					prev
						? {
								...prev,
								is_visible: vars.body.is_visible,
								status:
									vars.body.is_visible === false
										? 'INACTIVE'
										: 'ACTIVE',
							}
						: prev
				)
			}
		},
		onError: () => toast.error('Ocorreu um erro'),
	})
	const deleteMutation = useMutation({
		mutationFn: async (ids: string[]) => {
			await Promise.all(ids.map((id) => deleteProduct(id)))
			return ids
		},
		onSuccess: (ids) => {
			toast.success(
				ids.length > 1
					? `${ids.length} produtos eliminados`
					: 'Produto eliminado'
			)
			setConfirmDelete(null)
			setConfirmBulkDelete(false)
			setSelected(new Set())
			if (preview && ids.includes(preview.id as string)) {
				setPreview(null)
			}
			qc.invalidateQueries({ queryKey: ['admin-products'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})
	const products: AdminProduct[] = data?.products ?? []
	const hasFilters = Boolean(deferredSearch) || status !== 'all'
	function toggleSelect(id: string) {
		setSelected((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}
	function toggleSelectAll() {
		if (selected.size === products.length) {
			setSelected(new Set())
			return
		}
		setSelected(new Set(products.map((p) => p.id as string)))
	}
	function pauseSelected() {
		for (const id of selected) {
			patchMutation.mutate({ id, body: { is_visible: false } })
		}
		setSelected(new Set())
	}
	function clearFilters() {
		setSearch('')
		setStatus('all')
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
		confirmBulkDelete,
		setConfirmBulkDelete,
		preview,
		setPreview,
		products,
		hasFilters,
		isLoading,
		isFetching,
		patchMutation,
		deleteMutation,
		toggleSelect,
		toggleSelectAll,
		pauseSelected,
		clearFilters,
	}
}
