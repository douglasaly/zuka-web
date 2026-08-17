'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { hasAdminAccess } from '@/lib/auth/roles'
export type Category = {
	id: string
	name: string
	slug: string
}
async function fetchCategories() {
	const res = await fetch('/api/admin/categories', { credentials: 'include' })
	if (!res.ok) throw new Error('Failed')
	return res.json()
}
async function fetchAdmins() {
	const res = await fetch('/api/admin/users', { credentials: 'include' })
	if (!res.ok) throw new Error('Failed')
	const data = await res.json()
	return {
		users: (data.users ?? []).filter((u: Record<string, unknown>) =>
			hasAdminAccess((u.roles as string[]) ?? [])
		),
	}
}
export function useAdminSettings() {
	const qc = useQueryClient()
	const [newCatName, setNewCatName] = useState('')
	const [editingCat, setEditingCat] = useState<{
		id: string
		name: string
	} | null>(null)
	const [confirmDeleteCat, setConfirmDeleteCat] = useState<string | null>(
		null
	)
	const { data: catData, isLoading: catsLoading } = useQuery({
		queryKey: ['admin-categories'],
		queryFn: fetchCategories,
	})
	const { data: adminsData, isLoading: adminsLoading } = useQuery({
		queryKey: ['admin-admins'],
		queryFn: fetchAdmins,
	})
	const cats: Category[] = catData?.categories ?? []
	const admins: Record<string, unknown>[] = adminsData?.users ?? []
	const addCatMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch('/api/admin/categories', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newCatName }),
			})
			if (!res.ok) throw new Error('Failed')
			return res.json()
		},
		onSuccess: () => {
			toast.success('Categoria adicionada')
			setNewCatName('')
			qc.invalidateQueries({ queryKey: ['admin-categories'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})
	const editCatMutation = useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) => {
			const res = await fetch('/api/admin/categories', {
				method: 'PATCH',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, name }),
			})
			if (!res.ok) throw new Error('Failed')
		},
		onSuccess: () => {
			toast.success('Categoria atualizada')
			setEditingCat(null)
			qc.invalidateQueries({ queryKey: ['admin-categories'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})
	const deleteCatMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch('/api/admin/categories', {
				method: 'DELETE',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }),
			})
			if (!res.ok) throw new Error('Failed')
		},
		onSuccess: () => {
			toast.success('Categoria eliminada')
			setConfirmDeleteCat(null)
			qc.invalidateQueries({ queryKey: ['admin-categories'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})
	const removeAdminMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch(`/api/admin/users/${id}`, {
				method: 'PATCH',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ removeAdmin: true }),
			})
			if (!res.ok) throw new Error('Failed')
		},
		onSuccess: () => {
			toast.success('Função admin removida')
			qc.invalidateQueries({ queryKey: ['admin-admins'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})
	return {
		newCatName,
		setNewCatName,
		editingCat,
		setEditingCat,
		confirmDeleteCat,
		setConfirmDeleteCat,
		cats,
		admins,
		catsLoading,
		adminsLoading,
		addCatMutation,
		editCatMutation,
		deleteCatMutation,
		removeAdminMutation,
	}
}
