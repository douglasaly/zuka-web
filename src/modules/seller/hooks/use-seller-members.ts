'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { STORE_ROLE_UI } from '@/lib/auth/store-permissions'
import type {
	InviteRole,
	Member,
	MembersResponse,
} from '@/modules/seller/ui/components/members/types'

export function useSellerMembers() {
	const [inviteOpen, setInviteOpen] = useState(false)
	const [email, setEmail] = useState('')
	const [role, setRole] = useState<InviteRole>('staff')
	const [removing, setRemoving] = useState<Member | null>(null)
	const queryClient = useQueryClient()

	const { data, isLoading, isError, refetch, error } =
		useQuery<MembersResponse>({
			queryKey: ['seller-members'],
			queryFn: async () => {
				const res = await fetch('/api/seller/members')
				const body = await res.json().catch(() => ({}))
				if (!res.ok) {
					throw new Error(body.error ?? 'Failed to load members')
				}
				return body
			},
		})

	const inviteMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch('/api/seller/members', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email.trim(), role }),
			})
			const body = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(body.error ?? 'Failed to invite')
			return body
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-members'] })
			queryClient.invalidateQueries({ queryKey: ['seller-access'] })
			closeInvite()
			toast.success('Membro adicionado à loja.')
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Não foi possível convidar.')
		},
	})

	const removeMutation = useMutation({
		mutationFn: async (memberId: string) => {
			const res = await fetch(`/api/seller/members/${memberId}`, {
				method: 'DELETE',
			})
			const body = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(body.error ?? 'Failed to remove')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-members'] })
			setRemoving(null)
			toast.success('Membro removido da loja.')
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Não foi possível remover.')
		},
	})

	const roleMutation = useMutation({
		mutationFn: async ({
			memberId,
			nextRole,
		}: {
			memberId: string
			nextRole: string
		}) => {
			const res = await fetch(`/api/seller/members/${memberId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ role: nextRole }),
			})
			const body = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(body.error ?? 'Failed to update role')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-members'] })
			toast.success('Função actualizada.')
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Não foi possível actualizar.')
		},
	})

	function closeInvite() {
		setInviteOpen(false)
		setEmail('')
		setRole('staff')
	}

	function openInvite() {
		setInviteOpen(true)
	}

	const members = data?.members ?? []
	const canManage = Boolean(data?.me?.canManage)
	const currentUserId = data?.me?.userId ?? null
	const roleCatalog = data?.roleCatalog ?? STORE_ROLE_UI
	const owner = members.find((m) => m.role === 'owner')
	const others = members.filter((m) => m.role !== 'owner')
	const inviteSummary = roleCatalog[role]?.summary
	const busy =
		removeMutation.isPending ||
		roleMutation.isPending ||
		inviteMutation.isPending

	const forbidden =
		isError &&
		error instanceof Error &&
		/permissão|Unauthorized|membro/i.test(error.message)

	return {
		inviteOpen,
		setInviteOpen,
		email,
		setEmail,
		role,
		setRole,
		removing,
		setRemoving,
		isLoading,
		isError,
		refetch,
		inviteMutation,
		removeMutation,
		roleMutation,
		closeInvite,
		openInvite,
		members,
		canManage,
		currentUserId,
		roleCatalog,
		owner,
		others,
		inviteSummary,
		busy,
		forbidden,
	}
}
