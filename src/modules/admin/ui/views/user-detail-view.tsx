'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '../components/status-badge'
import { ConfirmDialog } from '../components/confirm-dialog'
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

export function UserDetailView({ id }: { id: string }) {
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

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<Skeleton className='h-8 w-48' />
				<Skeleton className='h-64 rounded-2xl' />
			</div>
		)
	}
	if (!user)
		return (
			<p className='text-muted-foreground'>Utilizador não encontrado.</p>
		)

	return (
		<div className='max-w-2xl space-y-6'>
			<div className='flex items-center gap-3'>
				<Button
					render={
						<Link href='/admin/users'>
							<ArrowLeft className='size-4' />
						</Link>
					}
					variant='ghost'
					size='sm'
				/>
				<div className='flex items-center gap-3'>
					{user.avatar_url ? (
						<img
							src={user.avatar_url as string}
							alt=''
							className='size-12 rounded-full object-cover border border-border'
						/>
					) : (
						<div className='flex size-12 items-center justify-center rounded-full bg-muted font-bold text-lg uppercase'>
							{(user.first_name as string)?.[0] ?? '?'}
						</div>
					)}
					<div>
						<p className='font-heading font-bold'>
							{`${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()}
						</p>
						<p className='text-sm text-muted-foreground'>
							{user.email as string}
						</p>
					</div>
				</div>
			</div>

			<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
				<p className='border-b border-border/60 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
					Perfil
				</p>
				<div className='divide-y divide-border/40'>
					<DetailRow
						label='Nome'
						value={`${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()}
					/>
					<DetailRow label='Email' value={user.email as string} />
					<DetailRow
						label='Telefone'
						value={user.phone_number as string}
					/>
					<DetailRow label='Estado' value={undefined}>
						<StatusBadge
							status={(user.status as string) ?? 'ACTIVE'}
						/>
					</DetailRow>
					<DetailRow label='Funções' value={undefined}>
						<div className='flex flex-wrap gap-1'>
							{roles.length > 0 ? (
								roles.map((r) => (
									<StatusBadge key={r} status={r} />
								))
							) : (
								<StatusBadge status='buyer' />
							)}
						</div>
					</DetailRow>
					<DetailRow
						label='Criado em'
						value={
							user.created_at
								? format(
										new Date(user.created_at as string),
										'd MMM yyyy',
										{ locale: pt }
									)
								: '—'
						}
					/>
				</div>
			</div>

			{store && (
				<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
					<p className='border-b border-border/60 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Loja
					</p>
					<div className='divide-y divide-border/40'>
						<DetailRow label='Nome' value={undefined}>
							<Link
								href={`/admin/stores/${store.id as string}`}
								className='text-sm font-medium text-primary hover:underline'
							>
								{store.name as string}
							</Link>
						</DetailRow>
						<DetailRow label='Estado' value={undefined}>
							<StatusBadge status={store.status as string} />
						</DetailRow>
					</div>
				</div>
			)}

			<div className='flex flex-wrap gap-2'>
				{hasAdminRole ? (
					<Button
						type='button'
						variant='outline'
						onClick={() =>
							patchMutation.mutate({ removeAdmin: true })
						}
						disabled={patchMutation.isPending}
					>
						Remover função admin
					</Button>
				) : !isAdmin ? (
					<Button
						type='button'
						variant='outline'
						onClick={() =>
							patchMutation.mutate({ makeAdmin: true })
						}
						disabled={patchMutation.isPending}
					>
						Tornar admin
					</Button>
				) : null}
				{user.status !== 'INACTIVE' && (
					<Button
						type='button'
						variant='outline'
						className='border-amber-300 text-amber-700 hover:bg-amber-50'
						onClick={() => setConfirmAction('deactivate')}
					>
						Desativar conta
					</Button>
				)}
			</div>

			<div className='rounded-2xl border border-destructive/20 bg-destructive/5 p-5 space-y-3'>
				<p className='font-heading text-sm font-bold text-destructive'>
					Zona de perigo
				</p>
				<Button
					type='button'
					className='bg-destructive/90 text-white hover:bg-destructive'
					onClick={() => setConfirmAction('delete')}
				>
					Eliminar conta permanentemente
				</Button>
			</div>

			<ConfirmDialog
				open={confirmAction === 'deactivate'}
				onOpenChange={(v) => !v && setConfirmAction(null)}
				title='Desativar conta'
				description='O utilizador não poderá iniciar sessão até a conta ser reativada.'
				confirmLabel='Desativar'
				loading={patchMutation.isPending}
				onConfirm={() =>
					patchMutation.mutate(
						{ status: 'INACTIVE' },
						{ onSuccess: () => setConfirmAction(null) }
					)
				}
			/>
			<ConfirmDialog
				open={confirmAction === 'delete'}
				onOpenChange={(v) => !v && setConfirmAction(null)}
				title='Eliminar conta'
				description='Esta ação é irreversível. Todos os dados do utilizador serão eliminados.'
				confirmLabel='Eliminar'
				loading={deleteMutation.isPending}
				onConfirm={() => deleteMutation.mutate()}
			/>
		</div>
	)
}

function DetailRow({
	label,
	value,
	children,
}: {
	label: string
	value?: string | null
	children?: React.ReactNode
}) {
	if (!value && !children) return null
	return (
		<div className='flex items-center gap-3 px-4 py-2.5'>
			<span className='w-28 shrink-0 text-xs text-muted-foreground'>
				{label}
			</span>
			{children ?? <span className='text-sm font-medium'>{value}</span>}
		</div>
	)
}
