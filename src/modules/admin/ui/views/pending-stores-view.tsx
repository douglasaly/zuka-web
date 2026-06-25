'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { CheckCircle2, Clock, Image as ImageIcon, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetClose } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { EmptyState } from '../components/empty-state'
import { TableSkeleton } from '../components/table-skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

type StoreRow = Record<string, unknown>

async function fetchPending(): Promise<{ stores: StoreRow[] }> {
	const res = await fetch('/api/admin/stores?status=PENDING', { credentials: 'include' })
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function fetchStoreDetail(id: string) {
	const res = await fetch(`/api/admin/stores/${id}`, { credentials: 'include' })
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function updateStore(id: string, body: Record<string, unknown>) {
	const res = await fetch(`/api/admin/stores/${id}`, {
		method: 'PATCH',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

function ReviewPanel({
	storeId,
	onClose,
}: {
	storeId: string
	onClose: () => void
}) {
	const qc = useQueryClient()
	const [rejectionReason, setRejectionReason] = useState('')
	const [showReject, setShowReject] = useState(false)

	const { data, isLoading } = useQuery({
		queryKey: ['admin-store-detail', storeId],
		queryFn: () => fetchStoreDetail(storeId),
		enabled: Boolean(storeId),
	})

	const mutation = useMutation({
		mutationFn: ({ status, reason }: { status: string; reason?: string }) =>
			updateStore(storeId, { status, rejectionReason: reason }),
		onSuccess: (_, vars) => {
			toast.success(vars.status === 'ACTIVE' ? 'Loja aprovada com sucesso' : 'Loja rejeitada')
			qc.invalidateQueries({ queryKey: ['admin-pending-stores'] })
			qc.invalidateQueries({ queryKey: ['admin-stats'] })
			onClose()
		},
		onError: () => toast.error('Ocorreu um erro. Tenta novamente.'),
	})

	const store = data?.store as Record<string, unknown> | undefined
	const docs = (data?.docs ?? []) as Record<string, unknown>[]
	const owner = store?.users as Record<string, unknown> | undefined

	return (
		<div className='flex h-full flex-col'>
			<SheetHeader className='shrink-0 border-b border-border/60 px-6 py-4'>
				<SheetTitle className='font-heading text-base font-bold'>
					{isLoading ? <Skeleton className='h-5 w-40' /> : (store?.name as string ?? '—')}
				</SheetTitle>
			</SheetHeader>

			<div className='flex-1 overflow-y-auto px-6 py-5 space-y-6'>
				{isLoading ? (
					<div className='space-y-4'>
						{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className='h-10 rounded-xl' />)}
					</div>
				) : (
					<>
						{/* Store info */}
						<Section title='Informações da loja'>
							<Row label='Nome' value={store?.name as string} />
							<Row label='Descrição' value={store?.description as string} />
							<Row label='Categoria' value={(store?.categories as Record<string, unknown>)?.name as string} />
							<Row label='Localização' value={`${(store?.provinces as Record<string, unknown>)?.name as string ?? ''} · ${store?.state as string ?? ''}`} />
							<Row label='Email' value={store?.email as string} />
							<Row label='Telefone' value={store?.phone as string} />
							<Row label='WhatsApp' value={store?.whatsapp as string} />
						</Section>

						{/* Images */}
						{(Boolean(store?.logo_url) || Boolean(store?.banner_url)) && (
							<Section title='Imagens'>
								<div className='grid grid-cols-2 gap-3'>
									{Boolean(store?.logo_url) && (
										<img src={store!.logo_url as string} alt='Logo' className='aspect-square w-full rounded-xl object-cover border border-border' />
									)}
									{Boolean(store?.banner_url) && (
										<img src={store!.banner_url as string} alt='Banner' className='aspect-video w-full rounded-xl object-cover border border-border col-span-2' />
									)}
								</div>
							</Section>
						)}

						{/* Owner */}
						<Section title='Proprietário'>
							<Row label='Nome' value={`${owner?.first_name as string ?? ''} ${owner?.last_name as string ?? ''}`} />
							<Row label='Email' value={owner?.email as string} />
							<Row label='Telefone' value={owner?.phone_number as string} />
							<Row label='Conta criada' value={owner?.created_at ? format(new Date(owner.created_at as string), 'd MMM yyyy', { locale: pt }) : '—'} />
						</Section>

						{/* Verification docs */}
						{docs.length > 0 && (
							<Section title='Documentos de verificação'>
								<div className='grid grid-cols-2 gap-3'>
									{docs.map((doc) => (
										<a
											key={doc.id as string}
											href={doc.file_url as string}
											target='_blank'
											rel='noreferrer'
											className='group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted'
										>
											{doc.file_url ? (
												<img src={doc.file_url as string} alt={doc.type as string} className='h-full w-full object-cover' />
											) : (
												<div className='flex h-full items-center justify-center'>
													<ImageIcon className='size-8 text-muted-foreground' />
												</div>
											)}
											<div className='absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1'>
												<p className='text-xs text-white'>{doc.type as string}</p>
											</div>
										</a>
									))}
								</div>
							</Section>
						)}
					</>
				)}
			</div>

			{/* Actions */}
			<div className='shrink-0 border-t border-border/60 px-6 py-4 space-y-3'>
				{showReject ? (
					<div className='space-y-3'>
						<Textarea
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
							placeholder='Motivo de rejeição (obrigatório)...'
							className='min-h-20 resize-none text-sm'
						/>
						<div className='flex gap-2'>
							<Button type='button' variant='outline' className='flex-1' onClick={() => setShowReject(false)}>
								Cancelar
							</Button>
							<Button
								type='button'
								disabled={!rejectionReason.trim() || mutation.isPending}
								onClick={() => mutation.mutate({ status: 'REJECTED', reason: rejectionReason })}
								className='flex-1 bg-red-600 text-white hover:bg-red-700'
							>
								<XCircle className='size-4' />
								{mutation.isPending ? 'A rejeitar...' : 'Rejeitar'}
							</Button>
						</div>
					</div>
				) : (
					<div className='flex gap-2'>
						<Button
							type='button'
							variant='outline'
							className='flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
							onClick={() => setShowReject(true)}
						>
							<XCircle className='size-4' />
							Rejeitar
						</Button>
						<Button
							type='button'
							disabled={mutation.isPending}
							onClick={() => mutation.mutate({ status: 'ACTIVE' })}
							className='flex-1 bg-emerald-600 text-white hover:bg-emerald-700'
						>
							<CheckCircle2 className='size-4' />
							{mutation.isPending ? 'A aprovar...' : 'Aprovar'}
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div className='space-y-2'>
			<p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>{title}</p>
			<div className='rounded-xl border border-border/60 bg-muted/20 divide-y divide-border/40'>
				{children}
			</div>
		</div>
	)
}

function Row({ label, value }: { label: string; value?: string | null }) {
	if (!value) return null
	return (
		<div className='flex items-start gap-3 px-3 py-2.5'>
			<span className='w-24 shrink-0 text-xs text-muted-foreground'>{label}</span>
			<span className='min-w-0 break-words text-xs font-medium'>{value}</span>
		</div>
	)
}

function PendingStoresInner() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const reviewId = searchParams.get('review')

	const { data, isLoading } = useQuery({
		queryKey: ['admin-pending-stores-full'],
		queryFn: fetchPending,
	})

	const stores = data?.stores ?? []

	function openReview(id: string) {
		const params = new URLSearchParams(searchParams.toString())
		params.set('review', id)
		router.replace(`/admin/stores/pending?${params.toString()}`)
	}

	function closeReview() {
		router.replace('/admin/stores/pending')
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<p className='text-sm text-muted-foreground'>
					{isLoading ? '…' : `${stores.length} loja${stores.length !== 1 ? 's' : ''} aguarda${stores.length === 1 ? '' : 'm'} aprovação`}
				</p>
			</div>

			{isLoading ? (
				<TableSkeleton rows={5} cols={5} />
			) : stores.length === 0 ? (
				<EmptyState icon={Clock} message='Nenhuma loja aguarda aprovação neste momento.' />
			) : (
				<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Loja</TableHead>
								<TableHead>Proprietário</TableHead>
								<TableHead>Categoria</TableHead>
								<TableHead>Cidade</TableHead>
								<TableHead>Submetido</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{stores.map((store) => {
								const owner = store.users as Record<string, unknown>
								const category = store.categories as Record<string, unknown>
								const province = store.provinces as Record<string, unknown>
								return (
									<TableRow key={store.id as string}>
										<TableCell className='font-medium'>{store.name as string}</TableCell>
										<TableCell>
											<div>
												<p className='text-xs font-medium'>{`${owner?.first_name ?? ''} ${owner?.last_name ?? ''}`.trim() || '—'}</p>
												<p className='text-xs text-muted-foreground'>{owner?.email as string ?? '—'}</p>
											</div>
										</TableCell>
										<TableCell className='text-muted-foreground'>{category?.name as string ?? '—'}</TableCell>
										<TableCell className='text-muted-foreground'>{province?.name as string ?? '—'}</TableCell>
										<TableCell className='text-muted-foreground text-xs'>
											{store.created_at ? format(new Date(store.created_at as string), 'd MMM yyyy', { locale: pt }) : '—'}
										</TableCell>
										<TableCell>
											<Button size='sm' variant='outline' type='button' onClick={() => openReview(store.id as string)}>
												Rever
											</Button>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</div>
			)}

			{/* Review side panel */}
			<Sheet open={Boolean(reviewId)} onOpenChange={(v) => !v && closeReview()}>
				<SheetContent
					side='right'
					showCloseButton={false}
					className='w-full p-0 sm:max-w-[480px]'
				>
					{reviewId && (
						<ReviewPanel storeId={reviewId} onClose={closeReview} />
					)}
				</SheetContent>
			</Sheet>
		</div>
	)
}

export function PendingStoresView() {
	return (
		<Suspense>
			<PendingStoresInner />
		</Suspense>
	)
}
