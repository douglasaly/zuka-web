'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export type AdminUserRow = Record<string, unknown>

async function fetchUsers(search: string) {
	const params = new URLSearchParams()
	if (search) params.set('search', search)
	const res = await fetch(`/api/admin/users?${params}`, {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function patchUser(id: string, body: Record<string, unknown>) {
	const res = await fetch(`/api/admin/users/${id}`, {
		method: 'PATCH',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function deleteUser(id: string) {
	const res = await fetch(`/api/admin/users/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
}

export function useAdminUsers() {
	const [search, setSearch] = useState('')
	const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
	const qc = useQueryClient()

	const { data, isLoading } = useQuery({
		queryKey: ['admin-users', search],
		queryFn: () => fetchUsers(search),
	})

	const patchMutation = useMutation({
		mutationFn: ({
			id,
			body,
		}: {
			id: string
			body: Record<string, unknown>
		}) => patchUser(id, body),
		onSuccess: (_, vars) => {
			const msg = vars.body.makeAdmin
				? 'Utilizador promovido a admin'
				: vars.body.removeAdmin
					? 'Função admin removida'
					: vars.body.status === 'INACTIVE'
						? 'Utilizador desativado'
						: 'Utilizador atualizado'
			toast.success(msg)
			qc.invalidateQueries({ queryKey: ['admin-users'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteUser(id),
		onSuccess: () => {
			toast.success('Utilizador eliminado')
			setConfirmDelete(null)
			qc.invalidateQueries({ queryKey: ['admin-users'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const users: AdminUserRow[] = data?.users ?? []

	return {
		search,
		setSearch,
		confirmDelete,
		setConfirmDelete,
		users,
		isLoading,
		patchMutation,
		deleteMutation,
	}
}
