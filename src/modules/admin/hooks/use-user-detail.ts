'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { hasAdminAccess } from '@/lib/auth/roles'

async function fetchUser(id: string) {
	const res = await fetch(`/api/admin/users/${id}`, {
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
export function useUserDetail(id: string) {
	const [confirmAction, setConfirmAction] = useState<
		'delete' | 'deactivate' | null
	>(null)
	const qc = useQueryClient()
	const { data, isLoading } = useQuery({
		queryKey: ['admin-user-detail', id],
		queryFn: () => fetchUser(id),
	})
	const patchMutation = useMutation({
		mutationFn: (body: Record<string, unknown>) => patchUser(id, body),
		onSuccess: () => {
			toast.success('Utilizador atualizado')
			qc.invalidateQueries({ queryKey: ['admin-user-detail', id] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})
	const deleteMutation = useMutation({
		mutationFn: () => deleteUser(id),
		onSuccess: () => {
			toast.success('Utilizador eliminado')
			window.location.href = '/admin/users'
		},
		onError: () => toast.error('Ocorreu um erro'),
	})
	const user = data?.user as Record<string, unknown> | undefined
	const store = data?.store as Record<string, unknown> | undefined
	const roles = (user?.roles ?? []) as string[]
	const isAdmin = hasAdminAccess(roles)
	const hasAdminRole = roles.includes('admin')
	return {
		confirmAction,
		setConfirmAction,
		isLoading,
		user,
		store,
		roles,
		isAdmin,
		hasAdminRole,
		patchMutation,
		deleteMutation,
	}
}
