'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import Link from 'next/link'
import { Search, Store, ExternalLink, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { EmptyState } from '../components/empty-state'
import { StatusBadge } from '../components/status-badge'
import { ConfirmDialog } from '../components/confirm-dialog'

type StoreRow = Record<string, unknown>

const STATUS_OPTIONS = [
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

export function AllStoresView() {
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

	return (
		<div className='space-y-4'>
			{/* Filters */}
			<div className='flex flex-wrap items-center gap-3'>
				<div className='relative flex-1 min-w-48'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder='Pesquisar por nome...'
						className='pl-9'
					/>
				</div>
				<div className='flex gap-1'>
					{STATUS_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							type='button'
							onClick={() => setStatus(opt.value)}
							className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${status === opt.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}
						>
							{opt.label}
						</button>
					))}
				</div>
			</div>

			{/* Bulk actions */}
			{selected.size > 0 && (
				<div className='flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2'>
					<span className='text-xs font-medium text-muted-foreground'>
						{selected.size} selecionada
						{selected.size > 1 ? 's' : ''}
					</span>
					<Button
						size='sm'
						variant='outline'
						type='button'
						onClick={() =>
							selected.forEach((id) =>
								patchMutation.mutate({
									id,
									body: { status: 'SUSPENDED' },
								})
							)
						}
					>
						Suspender selecionadas
					</Button>
					<Button
						size='sm'
						type='button'
						className='bg-destructive/90 text-white hover:bg-destructive'
						onClick={() =>
							selected.forEach((id) => deleteMutation.mutate(id))
						}
					>
						Eliminar selecionadas
					</Button>
				</div>
			)}

			{isLoading ? (
				<Skeleton className='h-64 rounded-2xl' />
			) : stores.length === 0 ? (
				<EmptyState icon={Store} message='Nenhuma loja encontrada.' />
			) : (
				<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-8'>
									<input
										type='checkbox'
										className='size-4'
										checked={
											selected.size === stores.length &&
											stores.length > 0
										}
										onChange={toggleSelectAll}
									/>
								</TableHead>
								<TableHead>Loja</TableHead>
								<TableHead>Proprietário</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Produtos</TableHead>
								<TableHead>Seguidores</TableHead>
								<TableHead>Criada</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{stores.map((store) => {
								const owner = store.users as Record<
									string,
									unknown
								>
								return (
									<TableRow
										key={store.id as string}
										data-state={
											selected.has(store.id as string)
												? 'selected'
												: undefined
										}
									>
										<TableCell>
											<input
												type='checkbox'
												className='size-4'
												checked={selected.has(
													store.id as string
												)}
												onChange={() =>
													toggleSelect(
														store.id as string
													)
												}
											/>
										</TableCell>
										<TableCell>
											<Link
												href={`/admin/stores/${store.id as string}`}
												className='font-medium hover:underline'
											>
												{store.name as string}
											</Link>
										</TableCell>
										<TableCell>
											<div>
												<p className='text-xs font-medium'>
													{`${owner?.first_name ?? ''} ${owner?.last_name ?? ''}`.trim() ||
														'—'}
												</p>
												<p className='text-xs text-muted-foreground'>
													{(owner?.email as string) ??
														'—'}
												</p>
											</div>
										</TableCell>
										<TableCell>
											<StatusBadge
												status={store.status as string}
											/>
										</TableCell>
										<TableCell className='tabular-nums text-sm'>
											{store.productCount as number}
										</TableCell>
										<TableCell className='tabular-nums text-sm'>
											{store.followerCount as number}
										</TableCell>
										<TableCell className='text-xs text-muted-foreground'>
											{store.created_at
												? format(
														new Date(
															store.created_at as string
														),
														'd MMM yyyy',
														{ locale: pt }
													)
												: '—'}
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-1'>
												<Button
													size='sm'
													variant='ghost'
													render={
														<Link
															href={`/lojas/${store.slug as string}`}
															target='_blank'
														>
															<ExternalLink className='size-3.5' />
														</Link>
													}
												/>
												<Button
													size='sm'
													variant='ghost'
													render={
														<Link
															href={`/admin/stores/${store.id as string}`}
														>
															Detalhes
														</Link>
													}
												/>
												{store.status ===
												'SUSPENDED' ? (
													<Button
														size='sm'
														variant='ghost'
														type='button'
														className='text-emerald-600'
														onClick={() =>
															patchMutation.mutate(
																{
																	id: store.id as string,
																	body: {
																		status: 'ACTIVE',
																	},
																}
															)
														}
													>
														Reativar
													</Button>
												) : store.status ===
													'ACTIVE' ? (
													<Button
														size='sm'
														variant='ghost'
														type='button'
														className='text-amber-600'
														onClick={() =>
															patchMutation.mutate(
																{
																	id: store.id as string,
																	body: {
																		status: 'SUSPENDED',
																	},
																}
															)
														}
													>
														Suspender
													</Button>
												) : null}
												<Button
													size='sm'
													variant='ghost'
													type='button'
													className='text-destructive'
													onClick={() =>
														setConfirmDelete(
															store.id as string
														)
													}
												>
													<Trash2 className='size-3.5' />
												</Button>
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
				title='Eliminar loja'
				description='Esta ação é irreversível. A loja e todos os seus dados serão eliminados permanentemente.'
				confirmLabel='Eliminar loja'
				loading={deleteMutation.isPending}
				onConfirm={() =>
					confirmDelete && deleteMutation.mutate(confirmDelete)
				}
			/>
		</div>
	)
}
