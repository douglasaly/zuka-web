'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDeferredValue, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type {
	Category,
	CategoryForm,
} from '@/modules/seller/ui/components/categories/types'
import { EMPTY_FORM } from '@/modules/seller/ui/components/categories/types'
import { Slug } from '@/utils/slug'

export function useSellerCategories() {
	const queryClient = useQueryClient()
	const [form, setForm] = useState<CategoryForm | null>(null)
	const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
	const [query, setQuery] = useState('')
	const deferredQuery = useDeferredValue(query)

	const { data, isLoading, isError, refetch } = useQuery<{
		categories: Category[]
	}>({
		queryKey: ['seller-categories'],
		queryFn: async () => {
			const res = await fetch('/api/seller/categories')
			if (!res.ok) throw new Error('Failed to load categories')
			return res.json()
		},
	})

	const categories = data?.categories ?? []
	const roots = useMemo(
		() =>
			categories
				.filter((c) => !c.parentId)
				.sort(
					(a, b) =>
						a.position - b.position || a.name.localeCompare(b.name)
				),
		[categories]
	)

	function childrenOf(parentId: string) {
		return categories
			.filter((c) => c.parentId === parentId)
			.sort(
				(a, b) =>
					a.position - b.position || a.name.localeCompare(b.name)
			)
	}

	const visibleRoots = useMemo(() => {
		const q = deferredQuery.trim().toLowerCase()
		if (!q) return roots
		return roots.filter((cat) => {
			const kids = categories.filter((c) => c.parentId === cat.id)
			return (
				cat.name.toLowerCase().includes(q) ||
				cat.slug.toLowerCase().includes(q) ||
				kids.some(
					(k) =>
						k.name.toLowerCase().includes(q) ||
						k.slug.toLowerCase().includes(q)
				)
			)
		})
	}, [roots, categories, deferredQuery])

	const isFiltering = deferredQuery.trim().length > 0
	const subCount = categories.length - roots.length

	const saveMutation = useMutation({
		mutationFn: async () => {
			if (!form?.name.trim()) throw new Error('O nome é obrigatório')
			if (form.id) {
				const res = await fetch('/api/seller/categories', {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						id: form.id,
						name: form.name.trim(),
						slug: form.slug.trim() || Slug(form.name),
						parentId: form.parentId || null,
					}),
				})
				const json = await res.json()
				if (!res.ok)
					throw new Error(json.error ?? 'Não foi possível actualizar')
				return json
			}
			const res = await fetch('/api/seller/categories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: form.name.trim(),
					slug: form.slug.trim() || undefined,
					parentId: form.parentId || null,
				}),
			})
			const json = await res.json()
			if (!res.ok) throw new Error(json.error ?? 'Não foi possível criar')
			return json
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-categories'] })
			queryClient.invalidateQueries({ queryKey: ['categories'] })
			const wasEdit = Boolean(form?.id)
			setForm(null)
			toast.success(
				wasEdit ? 'Categoria actualizada' : 'Categoria criada'
			)
		},
		onError: (error: Error) => toast.error(error.message),
	})

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch('/api/seller/categories', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }),
			})
			const json = await res.json()
			if (!res.ok)
				throw new Error(json.error ?? 'Não foi possível eliminar')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-categories'] })
			queryClient.invalidateQueries({ queryKey: ['categories'] })
			setDeleteTarget(null)
			if (form?.id && form.id === deleteTarget?.id) setForm(null)
			toast.success('Categoria eliminada')
		},
		onError: (error: Error) => toast.error(error.message),
	})

	const reorderMutation = useMutation({
		mutationFn: async (items: Array<{ id: string; position: number }>) => {
			const res = await fetch('/api/seller/categories', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ items }),
			})
			const json = await res.json()
			if (!res.ok)
				throw new Error(json.error ?? 'Não foi possível reordenar')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-categories'] })
			queryClient.invalidateQueries({ queryKey: ['categories'] })
		},
		onError: (error: Error) => toast.error(error.message),
	})

	function move(list: Category[], index: number, direction: -1 | 1) {
		const target = index + direction
		if (target < 0 || target >= list.length) return
		const next = [...list]
		const tmp = next[index]
		next[index] = next[target]
		next[target] = tmp
		reorderMutation.mutate(
			next.map((item, position) => ({ id: item.id, position }))
		)
	}

	function openCreate() {
		setForm({ ...EMPTY_FORM })
	}

	function openEdit(cat: Category) {
		setForm({
			id: cat.id,
			name: cat.name,
			slug: cat.slug,
			parentId: cat.parentId ?? '',
		})
	}

	function clearDeleteTarget() {
		setDeleteTarget(null)
	}

	function confirmDelete() {
		if (deleteTarget) deleteMutation.mutate(deleteTarget.id)
	}

	return {
		form,
		setForm,
		deleteTarget,
		setDeleteTarget,
		query,
		setQuery,
		isLoading,
		isError,
		refetch,
		categories,
		roots,
		childrenOf,
		visibleRoots,
		isFiltering,
		subCount,
		saveMutation,
		deleteMutation,
		move,
		openCreate,
		openEdit,
		clearDeleteTarget,
		confirmDelete,
	}
}
