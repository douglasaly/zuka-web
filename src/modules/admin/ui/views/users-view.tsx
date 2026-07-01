'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import Link from 'next/link'
import { Search, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { EmptyState } from '../components/empty-state'
import { TableSkeleton } from '../components/table-skeleton'
import { StatusBadge } from '../components/status-badge'
import { ConfirmDialog } from '../components/confirm-dialog'
import { hasAdminAccess } from '@/lib/auth/roles'

type UserRow = Record<string, unknown>

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

export function UsersView() {
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

	const users: UserRow[] = data?.users ?? []

	return (
		<div className='space-y-4'>
			<div className='relative flex-1 max-w-sm'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
				<Input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder='Pesquisar por nome ou email...'
					className='pl-9'
				/>
			</div>

			{isLoading ? (
				<TableSkeleton rows={8} cols={7} />
			) : users.length === 0 ? (
				<EmptyState
					icon={Users}
					message='Nenhum utilizador encontrado.'
				/>
			) : (
				<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Utilizador</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Telefone</TableHead>
								<TableHead>Funções</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Criado</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => {
								const roles = (user.roles ?? []) as string[]
								const isAdmin = hasAdminAccess(roles)
								const hasAdminRole = roles.includes('admin')
								return (
									<TableRow key={user.id as string}>
										<TableCell>
											<div className='flex items-center gap-2'>
												{user.avatar_url ? (
													<img
														src={
															user.avatar_url as string
														}
														alt=''
														className='size-7 rounded-full object-cover'
													/>
												) : (
													<div className='flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold uppercase'>
														{(
															user.first_name as string
														)?.[0] ?? '?'}
													</div>
												)}
												<Link
													href={`/admin/users/${user.id as string}`}
													className='text-sm font-medium hover:underline'
												>
													{`${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() ||
														'—'}
												</Link>
											</div>
										</TableCell>
										<TableCell className='text-sm text-muted-foreground'>
											{(user.email as string) ?? '—'}
										</TableCell>
										<TableCell className='text-sm text-muted-foreground'>
											{(user.phone_number as string) ??
												'—'}
										</TableCell>
										<TableCell>
											<div className='flex flex-wrap gap-1'>
												{roles.map((r) => (
													<StatusBadge
														key={r}
														status={r}
													/>
												))}
											</div>
										</TableCell>
										<TableCell>
											<StatusBadge
												status={
													(user.status as string) ??
													'ACTIVE'
												}
											/>
										</TableCell>
										<TableCell className='text-xs text-muted-foreground'>
											{user.created_at
												? format(
														new Date(
															user.created_at as string
														),
														'd MMM yyyy',
														{ locale: pt }
													)
												: '—'}
										</TableCell>
										<TableCell>
											<div className='flex gap-1'>
												<Button
													size='sm'
													variant='ghost'
													render={
														<Link
															href={`/admin/users/${user.id as string}`}
														>
															Ver
														</Link>
													}
												/>
												{hasAdminRole ? (
													<Button
														size='sm'
														variant='ghost'
														type='button'
														className='text-muted-foreground'
														onClick={() =>
															patchMutation.mutate(
																{
																	id: user.id as string,
																	body: {
																		removeAdmin: true,
																	},
																}
															)
														}
													>
														Remover admin
													</Button>
												) : !isAdmin ? (
													<Button
														size='sm'
														variant='ghost'
														type='button'
														onClick={() =>
															patchMutation.mutate(
																{
																	id: user.id as string,
																	body: {
																		makeAdmin: true,
																	},
																}
															)
														}
													>
														Tornar admin
													</Button>
												) : null}
												{user.status !== 'INACTIVE' && (
													<Button
														size='sm'
														variant='ghost'
														type='button'
														className='text-amber-600'
														onClick={() =>
															patchMutation.mutate(
																{
																	id: user.id as string,
																	body: {
																		status: 'INACTIVE',
																	},
																}
															)
														}
													>
														Desativar
													</Button>
												)}
											</div>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</div>
			)}

			<ConfirmDialog
				open={Boolean(confirmDelete)}
				onOpenChange={(v) => !v && setConfirmDelete(null)}
				title='Eliminar utilizador'
				description='Esta ação é irreversível. A conta e todos os dados do utilizador serão eliminados.'
				confirmLabel='Eliminar'
				loading={deleteMutation.isPending}
				onConfirm={() =>
					confirmDelete && deleteMutation.mutate(confirmDelete)
				}
			/>
		</div>
	)
}
