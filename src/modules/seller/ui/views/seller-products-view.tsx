'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	Eye,
	FolderTree,
	Package,
	Pencil,
	Plus,
	Search,
	Trash2,
	X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { SellerProduct } from '@/lib/types/api/seller'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'
import { DeleteProductDialog } from '../components/delete-product-dialog'
import {
	PRODUCT_STATUS_LABELS,
	PRODUCT_STATUS_STYLES,
} from '../components/product-editor/constants'

const STATUS_OPTIONS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'ACTIVE', label: 'Activos' },
	{ value: 'INACTIVE', label: 'Pausados' },
	{ value: 'DRAFT', label: 'Rascunhos' },
]

export const SellerProductsView = () => {
	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [preview, setPreview] = useState<SellerProduct | null>(null)
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [categoryFilter, setCategoryFilter] = useState('all')
	const [minPrice, setMinPrice] = useState('')
	const [maxPrice, setMaxPrice] = useState('')
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const queryClient = useQueryClient()

	const queryParams = new URLSearchParams()
	if (statusFilter !== 'all') queryParams.set('status', statusFilter)
	if (categoryFilter !== 'all') queryParams.set('category', categoryFilter)
	if (search) queryParams.set('search', search)
	if (minPrice) queryParams.set('minPrice', minPrice)
	if (maxPrice) queryParams.set('maxPrice', maxPrice)

	const { data, isLoading } = useQuery<{ products: SellerProduct[] }>({
		queryKey: [
			'seller-products',
			statusFilter,
			categoryFilter,
			search,
			minPrice,
			maxPrice,
		],
		queryFn: async () => {
			const qs = queryParams.toString()
			const res = await fetch(`/api/seller/products${qs ? `?${qs}` : ''}`)
			if (!res.ok) throw new Error('Failed to load products')
			return res.json()
		},
		placeholderData: (prev) => prev,
	})

	const { data: categories } = useQuery<{ id: string; name: string }[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await fetch('/api/categories')
			if (!res.ok) return []
			const json = await res.json()
			const items = (json.data ?? json) as Array<Record<string, unknown>>
			if (!Array.isArray(items)) return []
			return items.map((row) => ({
				id: String(row.id),
				name: String(row.name),
			}))
		},
	})

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch(`/api/seller/products/${id}`, {
				method: 'DELETE',
			})
			if (!res.ok) throw new Error('Failed to delete product')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-products'] })
			setDeletingId(null)
			toast.success('Produto eliminado')
		},
		onError: () => toast.error('Erro ao eliminar produto'),
	})

	const bulkMutation = useMutation({
		mutationFn: async (action: 'delete' | 'activate' | 'deactivate') => {
			const res = await fetch('/api/seller/products/bulk', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action, ids: Array.from(selected) }),
			})
			if (!res.ok) throw new Error('Bulk action failed')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-products'] })
			setSelected(new Set())
			toast.success('Acção aplicada')
		},
		onError: () => toast.error('Erro na acção em massa'),
	})

	const products = data?.products ?? []
	const deletingProduct = products.find((p) => p.id === deletingId) ?? null
	const allSelected = products.length > 0 && selected.size === products.length

	function toggleAll() {
		if (allSelected) setSelected(new Set())
		else setSelected(new Set(products.map((p) => p.id)))
	}

	function toggleOne(id: string) {
		const next = new Set(selected)
		if (next.has(id)) next.delete(id)
		else next.add(id)
		setSelected(next)
	}

	const hasFilters =
		Boolean(search) ||
		statusFilter !== 'all' ||
		categoryFilter !== 'all' ||
		Boolean(minPrice) ||
		Boolean(maxPrice)

	if (isLoading) {
		return (
			<div className='space-y-3'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4'
					>
						<Skeleton className='size-16 rounded-lg' />
						<div className='flex-1 space-y-1.5'>
							<Skeleton className='h-4 w-40' />
							<Skeleton className='h-3 w-24' />
						</div>
					</div>
				))}
			</div>
		)
	}

	return (
		<div className='space-y-5'>
			<div className='flex flex-wrap items-center justify-between gap-3'>
				<div>
					<h1 className='font-heading text-xl font-bold'>Produtos</h1>
					<p className='text-sm text-muted-foreground'>
						{products.length}{' '}
						{products.length === 1 ? 'produto' : 'produtos'}
					</p>
				</div>
				<div className='flex flex-wrap gap-2'>
					<Button
						variant='outline'
						size='sm'
						className='rounded-full'
						render={
							<Link href='/dashboard/seller/produtos/categorias'>
								<FolderTree className='size-3.5' />
								Categorias
							</Link>
						}
					/>
					<Button
						className='rounded-full'
						render={
							<Link href='/dashboard/seller/produtos/novo'>
								<Plus className='size-4' />
								Novo produto
							</Link>
						}
					/>
				</div>
			</div>

			<div className='flex flex-wrap items-center gap-2'>
				<div className='relative min-w-50 max-w-sm flex-1'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Pesquisar produtos...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className='pl-9 pr-9'
					/>
					{search ? (
						<button
							type='button'
							onClick={() => setSearch('')}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
						>
							<X className='size-4' />
						</button>
					) : null}
				</div>

				<Select
					value={statusFilter}
					onValueChange={(v) => v && setStatusFilter(v)}
				>
					<SelectTrigger className='w-36'>
						<SelectValue placeholder='Estado' />
					</SelectTrigger>
					<SelectContent>
						{STATUS_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={categoryFilter}
					onValueChange={(v) => v && setCategoryFilter(v)}
				>
					<SelectTrigger className='w-40'>
						<SelectValue placeholder='Categoria' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todas</SelectItem>
						{(categories ?? []).map((cat) => (
							<SelectItem key={cat.id} value={cat.id}>
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Input
					type='number'
					min={0}
					placeholder='Preço min'
					value={minPrice}
					onChange={(e) => setMinPrice(e.target.value)}
					className='w-28'
				/>
				<Input
					type='number'
					min={0}
					placeholder='Preço max'
					value={maxPrice}
					onChange={(e) => setMaxPrice(e.target.value)}
					className='w-28'
				/>
			</div>

			{selected.size > 0 ? (
				<div className='flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5'>
					<span className='text-sm font-medium'>
						{selected.size} seleccionado
						{selected.size > 1 ? 's' : ''}
					</span>
					<div className='ml-auto flex flex-wrap items-center gap-1'>
						<Button
							variant='outline'
							size='sm'
							className='rounded-full text-xs'
							onClick={() => bulkMutation.mutate('activate')}
							disabled={bulkMutation.isPending}
						>
							Activar
						</Button>
						<Button
							variant='outline'
							size='sm'
							className='rounded-full text-xs'
							onClick={() => bulkMutation.mutate('deactivate')}
							disabled={bulkMutation.isPending}
						>
							Pausar
						</Button>
						<Button
							variant='destructive'
							size='sm'
							className='rounded-full text-xs'
							onClick={() => bulkMutation.mutate('delete')}
							disabled={bulkMutation.isPending}
						>
							Eliminar
						</Button>
					</div>
				</div>
			) : null}

			{products.length === 0 ? (
				<div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-20 text-center'>
					<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
						<Package className='size-8 text-muted-foreground' />
					</div>
					<h2 className='mt-4 font-heading text-xl font-bold'>
						{hasFilters
							? 'Nenhum resultado'
							: 'Nenhum produto ainda'}
					</h2>
					<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
						{hasFilters
							? 'Tente ajustar os filtros ou a pesquisa.'
							: 'Adicione o primeiro produto da sua loja.'}
					</p>
					{!hasFilters ? (
						<Button
							className='mt-6 rounded-full'
							render={
								<Link href='/dashboard/seller/produtos/novo'>
									<Plus className='size-4' />
									Adicionar produto
								</Link>
							}
						/>
					) : null}
				</div>
			) : (
				<div className='space-y-2'>
					<div className='flex items-center gap-2 border-b border-border/50 pb-2'>
						<input
							type='checkbox'
							checked={allSelected}
							onChange={toggleAll}
							className='size-4 rounded border-input'
						/>
						<span className='text-xs text-muted-foreground'>
							Seleccionar todos
						</span>
					</div>

					{products.map((product) => {
						const statusKey = product.status?.toUpperCase?.() ?? ''
						return (
							<div
								key={product.id}
								className={cn(
									'flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:bg-accent/40',
									product.status !== 'ACTIVE' && 'opacity-80',
									selected.has(product.id) &&
										'border-primary/40 bg-primary/5'
								)}
							>
								<input
									type='checkbox'
									checked={selected.has(product.id)}
									onChange={() => toggleOne(product.id)}
									className='size-4 rounded border-input'
								/>
								<button
									type='button'
									onClick={() => setPreview(product)}
									className='relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted'
								>
									{product.image ? (
										<Image
											src={product.image}
											alt={product.name}
											fill
											className='object-cover'
											sizes='64px'
											placeholder='blur'
											blurDataURL={BLUR_PLACEHOLDER}
										/>
									) : (
										<div className='flex size-full items-center justify-center'>
											<Package className='size-5 text-muted-foreground' />
										</div>
									)}
								</button>

								<div className='min-w-0 flex-1'>
									<p className='truncate font-medium'>
										{product.name}
									</p>
									<div className='mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm'>
										<span className='font-semibold text-primary'>
											{formatPrice(
												product.price,
												product.currency
											)}
										</span>
										{product.categoryName ? (
											<span className='text-muted-foreground'>
												· {product.categoryName}
											</span>
										) : null}
									</div>
								</div>

								<span
									className={`hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline ${PRODUCT_STATUS_STYLES[statusKey] ?? 'bg-muted text-muted-foreground'}`}
								>
									{PRODUCT_STATUS_LABELS[statusKey] ??
										product.status}
								</span>

								<div className='flex items-center gap-0.5'>
									<Tooltip>
										<TooltipTrigger
											render={
												<Button
													variant='ghost'
													size='icon-sm'
													className='rounded-full'
													aria-label='Pré-visualizar'
													onClick={() =>
														setPreview(product)
													}
												>
													<Eye className='size-4' />
												</Button>
											}
										/>
										<TooltipContent>
											Pré-visualizar
										</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger
											render={
												<Button
													variant='ghost'
													size='icon-sm'
													className='rounded-full'
													aria-label='Editar'
													render={
														<Link
															href={`/dashboard/seller/produtos/${product.id}/editar`}
														/>
													}
												>
													<Pencil className='size-4' />
												</Button>
											}
										/>
										<TooltipContent>Editar</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger
											render={
												<Button
													variant='ghost'
													size='icon-sm'
													className='rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive'
													aria-label='Eliminar'
													onClick={() =>
														setDeletingId(
															product.id
														)
													}
												>
													<Trash2 className='size-4' />
												</Button>
											}
										/>
										<TooltipContent>
											Eliminar
										</TooltipContent>
									</Tooltip>
								</div>
							</div>
						)
					})}
				</div>
			)}

			<DeleteProductDialog
				product={
					deletingProduct
						? {
								id: deletingProduct.id,
								name: deletingProduct.name,
								price: formatPrice(
									deletingProduct.price,
									deletingProduct.currency
								),
								imageUrl: deletingProduct.image ?? '',
							}
						: null
				}
				onOpenChange={(open) => {
					if (!open) setDeletingId(null)
				}}
				onConfirm={() => {
					if (deletingId) deleteMutation.mutate(deletingId)
				}}
				isDeleting={deleteMutation.isPending}
			/>

			<Sheet
				open={Boolean(preview)}
				onOpenChange={(open) => {
					if (!open) setPreview(null)
				}}
			>
				<SheetContent side='right' className='w-full sm:max-w-[440px]'>
					{preview ? (
						<>
							<SheetHeader>
								<SheetTitle className='font-heading'>
									{preview.name}
								</SheetTitle>
								<SheetDescription>
									Pré-visualização rápida do produto
								</SheetDescription>
							</SheetHeader>
							<div className='space-y-4 overflow-y-auto px-1 pb-6'>
								<div className='relative aspect-[4/3] overflow-hidden rounded-xl bg-muted'>
									{preview.image ? (
										<Image
											src={preview.image}
											alt={preview.name}
											fill
											className='object-cover'
											sizes='440px'
										/>
									) : (
										<div className='flex size-full items-center justify-center'>
											<Package className='size-10 text-muted-foreground' />
										</div>
									)}
								</div>
								{preview.images?.length > 1 ? (
									<div className='flex gap-2 overflow-x-auto'>
										{preview.images.map((url) => (
											<div
												key={url}
												className='relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted'
											>
												<Image
													src={url}
													alt=''
													fill
													className='object-cover'
													sizes='56px'
												/>
											</div>
										))}
									</div>
								) : null}
								<div className='flex items-center justify-between gap-3'>
									<p className='text-2xl font-bold text-primary'>
										{formatPrice(
											preview.price,
											preview.currency
										)}
									</p>
									<span
										className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRODUCT_STATUS_STYLES[preview.status] ?? 'bg-muted text-muted-foreground'}`}
									>
										{PRODUCT_STATUS_LABELS[
											preview.status
										] ?? preview.status}
									</span>
								</div>
								<p className='text-sm text-muted-foreground'>
									{preview.categoryName ?? 'Sem categoria'}
								</p>
								{preview.description ? (
									<p className='whitespace-pre-wrap text-sm leading-relaxed'>
										{preview.description}
									</p>
								) : null}
								<Button
									className='w-full rounded-full'
									render={
										<Link
											href={`/dashboard/seller/produtos/${preview.id}/editar`}
										>
											<Pencil className='size-4' />
											Editar produto
										</Link>
									}
								/>
							</div>
						</>
					) : null}
				</SheetContent>
			</Sheet>
		</div>
	)
}
