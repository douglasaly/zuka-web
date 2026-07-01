'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import Link from 'next/link'
import {
	ExternalLink,
	Image as ImageIcon,
	Package,
	Search,
	X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
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

type Product = Record<string, unknown>

async function fetchProducts(search: string, category: string) {
	const params = new URLSearchParams()
	if (search) params.set('search', search)
	if (category) params.set('category', category)
	const res = await fetch(`/api/admin/products?${params}`, {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function patchProduct(id: string, body: Record<string, unknown>) {
	const res = await fetch(`/api/admin/products/${id}`, {
		method: 'PATCH',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function deleteProduct(id: string) {
	const res = await fetch(`/api/admin/products/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
}

export function AdminProductsView() {
	const [search, setSearch] = useState('')
	const [category, setCategory] = useState('')
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
	const [preview, setPreview] = useState<Product | null>(null)
	const qc = useQueryClient()

	const { data, isLoading } = useQuery({
		queryKey: ['admin-products', search, category],
		queryFn: () => fetchProducts(search, category),
	})

	const patchMutation = useMutation({
		mutationFn: ({
			id,
			body,
		}: {
			id: string
			body: Record<string, unknown>
		}) => patchProduct(id, body),
		onSuccess: (_, vars) => {
			toast.success(
				vars.body.is_visible === false
					? 'Produto pausado'
					: 'Produto reativado'
			)
			qc.invalidateQueries({ queryKey: ['admin-products'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteProduct(id),
		onSuccess: () => {
			toast.success('Produto eliminado')
			setConfirmDelete(null)
			qc.invalidateQueries({ queryKey: ['admin-products'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const products: Product[] = data?.products ?? []

	function toggleSelect(id: string) {
		setSelected((prev) => {
			const n = new Set(prev)
			if (n.has(id)) n.delete(id)
			else n.add(id)
			return n
		})
	}

	function getThumb(product: Product): string | undefined {
		const imgs = product.product_images as Record<string, unknown>[]
		return (
			(imgs?.find((i) => i.is_primary)?.url as string | undefined) ??
			(imgs?.[0]?.url as string | undefined)
		)
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center gap-3'>
				<div className='relative flex-1 max-w-sm'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder='Pesquisar por nome...'
						className='pl-9'
					/>
				</div>
			</div>

			{selected.size > 0 && (
				<div className='flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2'>
					<span className='text-xs font-medium text-muted-foreground'>
						{selected.size} selecionado
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
									body: { is_visible: false },
								})
							)
						}
					>
						Pausar selecionados
					</Button>
					<Button
						size='sm'
						type='button'
						className='bg-destructive/90 text-white hover:bg-destructive'
						onClick={() =>
							selected.forEach((id) => deleteMutation.mutate(id))
						}
					>
						Eliminar selecionados
					</Button>
				</div>
			)}

			{isLoading ? (
				<TableSkeleton rows={8} cols={6} />
			) : products.length === 0 ? (
				<EmptyState
					icon={Package}
					message='Nenhum produto encontrado.'
				/>
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
											selected.size === products.length &&
											products.length > 0
										}
										onChange={() =>
											selected.size === products.length
												? setSelected(new Set())
												: setSelected(
														new Set(
															products.map(
																(p) =>
																	p.id as string
															)
														)
													)
										}
									/>
								</TableHead>
								<TableHead>Produto</TableHead>
								<TableHead>Loja</TableHead>
								<TableHead>Categoria</TableHead>
								<TableHead>Preço</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Criado</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{products.map((product) => {
								const thumb = getThumb(product)
								const store = product.stores as Record<
									string,
									unknown
								>
								const cat = product.categories as Record<
									string,
									unknown
								>
								return (
									<TableRow
										key={product.id as string}
										data-state={
											selected.has(product.id as string)
												? 'selected'
												: undefined
										}
									>
										<TableCell>
											<input
												type='checkbox'
												className='size-4'
												checked={selected.has(
													product.id as string
												)}
												onChange={() =>
													toggleSelect(
														product.id as string
													)
												}
											/>
										</TableCell>
										<TableCell>
											<button
												type='button'
												onClick={() =>
													setPreview(product)
												}
												className='flex items-center gap-2 text-left'
											>
												{thumb ? (
													<img
														src={thumb}
														alt=''
														className='size-8 rounded-md object-cover border border-border shrink-0'
													/>
												) : (
													<div className='flex size-8 shrink-0 items-center justify-center rounded-md bg-muted'>
														<ImageIcon className='size-4 text-muted-foreground' />
													</div>
												)}
												<span className='font-medium text-sm hover:underline'>
													{product.name as string}
												</span>
											</button>
										</TableCell>
										<TableCell>
											{store ? (
												<Link
													href={`/admin/stores/${store.id as string}`}
													className='text-sm text-muted-foreground hover:underline'
												>
													{store.name as string}
												</Link>
											) : (
												<span className='text-muted-foreground'>
													—
												</span>
											)}
										</TableCell>
										<TableCell className='text-muted-foreground'>
											{(cat?.name as string) ?? '—'}
										</TableCell>
										<TableCell className='font-medium'>
											{product.price
												? `${(product.currency as string) ?? 'MZN'} ${Number(product.price).toLocaleString('pt-PT')}`
												: '—'}
										</TableCell>
										<TableCell>
											<StatusBadge
												status={
													product.is_visible
														? 'ACTIVE'
														: 'SUSPENDED'
												}
											/>
										</TableCell>
										<TableCell className='text-xs text-muted-foreground'>
											{product.created_at
												? format(
														new Date(
															product.created_at as string
														),
														'd MMM yyyy',
														{ locale: pt }
													)
												: '—'}
										</TableCell>
										<TableCell>
											<div className='flex gap-1'>
												{product.is_visible ? (
													<Button
														size='sm'
														variant='ghost'
														type='button'
														className='text-amber-600'
														onClick={() =>
															patchMutation.mutate(
																{
																	id: product.id as string,
																	body: {
																		is_visible: false,
																	},
																}
															)
														}
													>
														Pausar
													</Button>
												) : (
													<Button
														size='sm'
														variant='ghost'
														type='button'
														className='text-emerald-600'
														onClick={() =>
															patchMutation.mutate(
																{
																	id: product.id as string,
																	body: {
																		is_visible: true,
																	},
																}
															)
														}
													>
														Reativar
													</Button>
												)}
												<Button
													size='sm'
													variant='ghost'
													type='button'
													className='text-destructive'
													onClick={() =>
														setConfirmDelete(
															product.id as string
														)
													}
												>
													Eliminar
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

			{/* Product side panel */}
			<Sheet
				open={Boolean(preview)}
				onOpenChange={(v) => !v && setPreview(null)}
			>
				<SheetContent side='right' className='w-full sm:max-w-[480px]'>
					{preview && (
						<>
							<SheetHeader>
								<SheetTitle className='font-heading'>
									{preview.name as string}
								</SheetTitle>
							</SheetHeader>
							<div className='mt-4 space-y-4 overflow-y-auto'>
								{/* Images carousel */}
								<div className='flex gap-2 overflow-x-auto pb-1'>
									{(
										(preview.product_images ??
											[]) as Record<string, unknown>[]
									).map((img, i) => (
										<img
											key={i}
											src={img.url as string}
											alt=''
											className='h-36 w-auto shrink-0 rounded-xl object-cover border border-border'
										/>
									))}
								</div>
								<div className='space-y-2 text-sm'>
									{Boolean(preview.description) && (
										<p className='text-muted-foreground'>
											{String(preview.description)}
										</p>
									)}
									<div className='flex items-center justify-between'>
										<span className='font-bold text-lg'>
											{preview.price
												? `${(preview.currency as string) ?? 'MZN'} ${Number(preview.price).toLocaleString('pt-PT')}`
												: '—'}
										</span>
										<StatusBadge
											status={
												Boolean(preview.is_visible)
													? 'ACTIVE'
													: 'SUSPENDED'
											}
										/>
									</div>
									{Boolean(
										(
											preview.stores as Record<
												string,
												unknown
											>
										)?.name
									) && (
										<Link
											href={`/admin/stores/${(preview.stores as Record<string, unknown>)?.id as string}`}
											className='flex items-center gap-1 text-xs text-primary hover:underline'
										>
											{String(
												(
													preview.stores as Record<
														string,
														unknown
													>
												)?.name
											)}
											<ExternalLink className='size-3' />
										</Link>
									)}
								</div>
							</div>
						</>
					)}
				</SheetContent>
			</Sheet>

			<ConfirmDialog
				open={Boolean(confirmDelete)}
				onOpenChange={(v) => !v && setConfirmDelete(null)}
				title='Eliminar produto'
				description='Esta ação é irreversível. O produto será eliminado permanentemente.'
				confirmLabel='Eliminar'
				loading={deleteMutation.isPending}
				onConfirm={() =>
					confirmDelete && deleteMutation.mutate(confirmDelete)
				}
			/>
		</div>
	)
}
