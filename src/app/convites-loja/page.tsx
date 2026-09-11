'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type StoreInvite = {
	memberId: string
	role: string
	invitedAt: string | null
	store: {
		id: string
		name: string
		slug: string
	}
}

export default function StoreInvitesPage() {
	const queryClient = useQueryClient()
	const { data, isLoading, isError } = useQuery({
		queryKey: ['store-invites'],
		queryFn: async () => {
			const res = await fetch('/api/me/store-invites')
			if (res.status === 401) {
				throw new Error('unauthorized')
			}
			const json = await res.json()
			if (!res.ok) {
				throw new Error(json.error ?? 'Falha ao carregar convites')
			}
			return (json.invites ?? []) as StoreInvite[]
		},
	})
	const acceptMutation = useMutation({
		mutationFn: async (storeId: string) => {
			const res = await fetch('/api/me/store-invites/accept', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ storeId }),
			})
			const json = await res.json().catch(() => ({}))
			if (!res.ok) {
				throw new Error(
					json.error ?? 'Não foi possível aceitar o convite'
				)
			}
		},
		onSuccess: () => {
			toast.success(
				'Convite aceite. Já podes aceder ao painel do vendedor.'
			)
			queryClient.invalidateQueries({ queryKey: ['store-invites'] })
		},
		onError: (err: Error) => toast.error(err.message),
	})
	const invites = data ?? []
	if (isLoading) {
		return (
			<div className='mx-auto max-w-lg px-4 py-16 text-center text-muted-foreground'>
				A carregar convites…
			</div>
		)
	}
	if (isError) {
		return (
			<div className='mx-auto max-w-lg space-y-4 px-4 py-16 text-center'>
				<p className='text-muted-foreground'>
					Inicia sessão para ver convites de loja.
				</p>
				<Button
					render={<Link href='/auth/login?next=/convites-loja' />}
				>
					Entrar
				</Button>
			</div>
		)
	}
	return (
		<div className='mx-auto max-w-lg space-y-6 px-4 py-16'>
			<div className='space-y-2 text-center'>
				<h1 className='text-2xl font-semibold'>Convites de loja</h1>
				<p className='text-sm text-muted-foreground'>
					Aceita um convite para entrar na equipe de uma loja.
				</p>
			</div>
			{invites.length === 0 ? (
				<p className='text-center text-muted-foreground'>
					Não tens convites pendentes.
				</p>
			) : (
				<ul className='space-y-3'>
					{invites.map((invite) => (
						<li
							key={invite.memberId}
							className='flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card p-4'
						>
							<div>
								<p className='font-medium'>
									{invite.store.name}
								</p>
								<p className='text-sm text-muted-foreground'>
									Função: {invite.role}
								</p>
							</div>
							<Button
								size='sm'
								disabled={acceptMutation.isPending}
								onClick={() =>
									acceptMutation.mutate(invite.store.id)
								}
							>
								Aceitar
							</Button>
						</li>
					))}
				</ul>
			)}
			<div className='flex justify-center'>
				<Button
					variant='outline'
					render={<Link href='/dashboard/seller' />}
				>
					Ir para o painel
				</Button>
			</div>
		</div>
	)
}
