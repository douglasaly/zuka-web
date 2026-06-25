'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '../components/status-badge'
import { ConfirmDialog } from '../components/confirm-dialog'

async function fetchStore(id: string) {
	const res = await fetch(`/api/admin/stores/${id}`, { credentials: 'include' })
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
	const res = await fetch(`/api/admin/stores/${id}`, { method: 'DELETE', credentials: 'include' })
	if (!res.ok) throw new Error('Failed')
}

const TABS = ['Informações', 'Produtos', 'Atividade']

export function StoreDetailView({ id }: { id: string }) {
	const [tab, setTab] = useState('Informações')
	const [confirmAction, setConfirmAction] = useState<'delete' | 'suspend' | null>(null)
	const qc = useQueryClient()

	const { data, isLoading } = useQuery({
		queryKey: ['admin-store-detail', id],
		queryFn: () => fetchStore(id),
	})

	const patchMutation = useMutation({
		mutationFn: (body: Record<string, unknown>) => patchStore(id, body),
		onSuccess: () => {
			toast.success('Loja atualizada')
			qc.invalidateQueries({ queryKey: ['admin-store-detail', id] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const deleteMutation = useMutation({
		mutationFn: () => deleteStore(id),
		onSuccess: () => {
			toast.success('Loja eliminada')
			window.location.href = '/admin/stores'
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const store = data?.store as Record<string, unknown> | undefined
	const docs = (data?.docs ?? []) as Record<string, unknown>[]
	const products = (data?.products ?? []) as Record<string, unknown>[]
	const owner = store?.users as Record<string, unknown> | undefined
	const province = store?.provinces as Record<string, unknown> | undefined

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<Skeleton className='h-8 w-48' />
				<div className='grid gap-4 md:grid-cols-2'>
					<Skeleton className='h-64 rounded-2xl' />
					<Skeleton className='h-64 rounded-2xl' />
				</div>
			</div>
		)
	}

	if (!store) {
		return <p className='text-muted-foreground'>Loja não encontrada.</p>
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center gap-3'>
				<Button render={<Link href='/admin/stores'><ArrowLeft className='size-4' /></Link>} variant='ghost' size='sm' />
				<div className='flex items-center gap-3'>
					{store.logo_url ? (
						<img src={store.logo_url as string} alt='' className='size-10 rounded-xl object-cover border border-border' />
					) : (
						<div className='flex size-10 items-center justify-center rounded-xl bg-muted'>
							<ImageIcon className='size-5 text-muted-foreground' />
						</div>
					)}
					<div>
						<p className='font-heading font-bold'>{store.name as string}</p>
						<StatusBadge status={store.status as string} />
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className='flex gap-1 border-b border-border/60'>
				{TABS.map((t) => (
					<button
						key={t}
						type='button'
						onClick={() => setTab(t)}
						className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
					>
						{t}
					</button>
				))}
			</div>

			{tab === 'Informações' && (
				<div className='grid gap-6 md:grid-cols-2'>
					<div className='space-y-4'>
						<InfoCard title='Loja'>
							<InfoRow label='Nome' value={store.name as string} />
							<InfoRow label='Descrição' value={store.description as string} />
							<InfoRow label='Categoria' value={(store.categories as Record<string, unknown>)?.name as string} />
							<InfoRow label='Província' value={province?.name as string} />
							<InfoRow label='Estado' value={store.state as string} />
							<InfoRow label='Email' value={store.email as string} />
							<InfoRow label='Telefone' value={store.phone as string} />
							<InfoRow label='WhatsApp' value={store.whatsapp as string} />
							<InfoRow label='Criada' value={store.created_at ? format(new Date(store.created_at as string), 'd MMM yyyy', { locale: pt }) : '—'} />
							<InfoRow label='Seguidores' value={String(store.followerCount ?? 0)} />
						</InfoCard>

						<InfoCard title='Proprietário'>
							<InfoRow label='Nome' value={`${owner?.first_name ?? ''} ${owner?.last_name ?? ''}`.trim()} />
							<InfoRow label='Email' value={owner?.email as string} />
							<InfoRow label='Telefone' value={owner?.phone_number as string} />
							<InfoRow label='Conta' value={owner?.created_at ? format(new Date(owner.created_at as string), 'd MMM yyyy', { locale: pt }) : '—'} />
						</InfoCard>
					</div>

					<div className='space-y-4'>
						{(Boolean(store.logo_url) || Boolean(store.banner_url)) && (
							<InfoCard title='Imagens'>
								<div className='p-3 space-y-2'>
									{Boolean(store.logo_url) && (
										<img src={store.logo_url as string} alt='Logo' className='h-24 w-full rounded-lg object-contain border border-border' />
									)}
									{Boolean(store.banner_url) && (
										<img src={store.banner_url as string} alt='Banner' className='aspect-video w-full rounded-lg object-cover border border-border' />
									)}
								</div>
							</InfoCard>
						)}

						{docs.length > 0 && (
							<InfoCard title='Documentos de verificação'>
								<div className='grid grid-cols-2 gap-2 p-3'>
									{docs.map((doc) => (
										<a key={doc.id as string} href={doc.file_url as string} target='_blank' rel='noreferrer' className='group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted'>
											{doc.file_url ? (
												<img src={doc.file_url as string} alt={doc.type as string} className='h-full w-full object-cover' />
											) : (
												<div className='flex h-full items-center justify-center'><ImageIcon className='size-6 text-muted-foreground' /></div>
											)}
											<div className='absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1'>
												<p className='text-xs text-white'>{doc.type as string}</p>
											</div>
										</a>
									))}
								</div>
							</InfoCard>
						)}
					</div>
				</div>
			)}

			{tab === 'Produtos' && (
				<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Produto</TableHead>
								<TableHead>Categoria</TableHead>
								<TableHead>Preço</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Criado</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{products.map((p) => {
								const imgs = p.product_images as Record<string, unknown>[]
								const primary = imgs?.find((i) => i.is_primary)?.url as string
								return (
									<TableRow key={p.id as string}>
										<TableCell>
											<div className='flex items-center gap-2'>
												{primary ? (
													<img src={primary} alt='' className='size-8 rounded-md object-cover border border-border' />
												) : (
													<div className='flex size-8 items-center justify-center rounded-md bg-muted'><ImageIcon className='size-4 text-muted-foreground' /></div>
												)}
												<span className='text-sm font-medium'>{p.name as string}</span>
											</div>
										</TableCell>
										<TableCell className='text-muted-foreground'>{(p.categories as Record<string, unknown>)?.name as string ?? '—'}</TableCell>
										<TableCell className='font-medium'>{p.price ? `${p.currency as string ?? 'MZN'} ${Number(p.price).toLocaleString('pt-PT')}` : '—'}</TableCell>
										<TableCell><StatusBadge status={(p.is_visible ? 'ACTIVE' : 'SUSPENDED')} /></TableCell>
										<TableCell className='text-xs text-muted-foreground'>{p.created_at ? format(new Date(p.created_at as string), 'd MMM yyyy', { locale: pt }) : '—'}</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</div>
			)}

			{tab === 'Atividade' && (
				<div className='rounded-2xl border border-border/60 bg-card p-6 text-center text-sm text-muted-foreground'>
					Registo de atividade disponível em breve.
				</div>
			)}

			{/* Danger zone */}
			<div className='rounded-2xl border border-destructive/20 bg-destructive/5 p-5 space-y-3'>
				<p className='font-heading text-sm font-bold text-destructive'>Zona de perigo</p>
				<div className='flex flex-wrap gap-2'>
					{store.status !== 'SUSPENDED' && (
						<Button
							type='button'
							variant='outline'
							className='border-amber-300 text-amber-700 hover:bg-amber-50'
							onClick={() => setConfirmAction('suspend')}
						>
							Suspender loja
						</Button>
					)}
					{store.status === 'SUSPENDED' && (
						<Button
							type='button'
							variant='outline'
							className='border-emerald-300 text-emerald-700 hover:bg-emerald-50'
							onClick={() => patchMutation.mutate({ status: 'ACTIVE' })}
						>
							Reativar loja
						</Button>
					)}
					<Button
						type='button'
						className='bg-destructive/90 text-white hover:bg-destructive'
						onClick={() => setConfirmAction('delete')}
					>
						Eliminar permanentemente
					</Button>
				</div>
			</div>

			<ConfirmDialog
				open={confirmAction === 'suspend'}
				onOpenChange={(v) => !v && setConfirmAction(null)}
				title='Suspender loja'
				description='A loja ficará invisível para compradores e os produtos serão ocultados.'
				confirmLabel='Suspender'
				loading={patchMutation.isPending}
				onConfirm={() => {
					patchMutation.mutate({ status: 'SUSPENDED' }, { onSuccess: () => setConfirmAction(null) })
				}}
			/>
			<ConfirmDialog
				open={confirmAction === 'delete'}
				onOpenChange={(v) => !v && setConfirmAction(null)}
				title='Eliminar loja permanentemente'
				description='Esta ação é irreversível. Todos os dados da loja serão eliminados.'
				confirmLabel='Eliminar'
				loading={deleteMutation.isPending}
				onConfirm={() => deleteMutation.mutate()}
			/>
		</div>
	)
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
			<p className='border-b border-border/60 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>{title}</p>
			<div className='divide-y divide-border/40'>{children}</div>
		</div>
	)
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
	if (!value) return null
	return (
		<div className='flex items-start gap-3 px-4 py-2.5'>
			<span className='w-28 shrink-0 text-xs text-muted-foreground'>{label}</span>
			<span className='break-words text-xs font-medium'>{value}</span>
		</div>
	)
}
