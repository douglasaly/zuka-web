'use client'

/**
 * THESIS: Catalog as a scannable inventory workbench — image leads, status/price
 * read instantly, actions stay icon-tight; refuses equal-weight text-button rows
 * and a cluttered filter strip.
 * OWN-WORLD: Zuka seller shell — rounded surfaces, font-heading, restrained
 * neutrals + primary accent, status chips from product-editor tokens.
 * STORY: Find → check state → edit or pause; bulk when needed.
 * FIRST VIEWPORT: Toolbar (count + CTAs) → status pills → searchable list.
 * FORM: Extend dashboard grammar (list density + sticky selection), not a new brand.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	Eye,
	FolderTree,
	Package,
	Pause,
	Pencil,
	Play,
	Plus,
	Search,
	SlidersHorizontal,
	Trash2,
	X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useDeferredValue, useState } from 'react'
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
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { SellerProduct } from '@/lib/types/api/seller'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'
import { DeleteProductDialog } from '../components/delete-product-dialog'
import { IconTooltipButton } from '../components/icon-tooltip-button'
import {
	PRODUCT_STATUS_LABELS,
	PRODUCT_STATUS_STYLES,
} from '../components/product-editor/constants'
import { useSetSellerPageMeta } from '../layouts/seller-page-meta'

const STATUS_OPTIONS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'ACTIVE', label: 'Activos' },
	{ value: 'INACTIVE', label: 'Pausados' },
	{ value: 'DRAFT', label: 'Rascunhos' },
] as const

function IconAction({
	label,
	onClick,
	href,
	className,
	children,
}: {
	label: string
	onClick?: () => void
	href?: string
	className?: string
	children: React.ReactNode
}) {
	return (
		<IconTooltipButton
			label={label}
			onClick={onClick}
			href={href}
			className={className}
		>
			{children}
		</IconTooltipButton>
	)
}

function ProductPrice({ product }: { product: SellerProduct }) {
	const discount = product.discountPrice
	const hasDiscount = discount != null && discount > 0

	if (hasDiscount) {
		return (
			<span className='flex flex-wrap items-baseline gap-x-1.5 gap-y-0'>
				<span className='font-semibold tabular-nums text-primary'>
					{formatPrice(discount, product.currency)}
				</span>
				<span className='text-xs tabular-nums text-muted-foreground line-through'>
					{formatPrice(product.price, product.currency)}
				</span>
			</span>
		)
	}

	return (
		<span className='font-semibold tabular-nums text-primary'>
			{formatPrice(product.price, product.currency)}
		</span>
	)
}

function StatusChip({ status }: { status: string }) {
	const key = status?.toUpperCase?.() ?? ''
	return (
		<span
			className={cn(
				'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
				PRODUCT_STATUS_STYLES[key] ??
					'bg-muted text-muted-foreground'
			)}
		>
			{PRODUCT_STATUS_LABELS[key] ?? status}
		</span>
	)
}

export const SellerProductsView = () => {
	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
	const [preview, setPreview] = useState<SellerProduct | null>(null)
	const [previewImage, setPreviewImage] = useState<string | null>(null)
	const [search, setSearch] = useState('')
	const deferredSearch = useDeferredValue(search.trim())
	const [statusFilter, setStatusFilter] = useState('all')
	const [categoryFilter, setCategoryFilter] = useState('all')
	const [minPrice, setMinPrice] = useState('')
	const [maxPrice, setMaxPrice] = useState('')
	const [showPriceFilters, setShowPriceFilters] = useState(false)
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const queryClient = useQueryClient()

	useSetSellerPageMeta({
		title: 'Produtos',
		crumbs: ['Dashboard', 'Produtos'],
	})

	const queryParams = new URLSearchParams()
	if (statusFilter !== 'all') queryParams.set('status', statusFilter)
	if (categoryFilter !== 'all') queryParams.set('category', categoryFilter)
	if (deferredSearch) queryParams.set('search', deferredSearch)
	if (minPrice) queryParams.set('minPrice', minPrice)
	if (maxPrice) queryParams.set('maxPrice', maxPrice)

	const { data, isLoading, isFetching } = useQuery<{
		products: SellerProduct[]
		total?: number
	}>({
		queryKey: [
			'seller-products',
			statusFilter,
			categoryFilter,
			deferredSearch,
			minPrice,
			maxPrice,
		],
		queryFn: async () => {
			const qs = queryParams.toString()
			const res = await fetch(
				`/api/seller/products${qs ? `?${qs}` : ''}`
			)
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
			if (preview?.id === deletingId) setPreview(null)
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
			return action
		},
		onSuccess: (action) => {
			queryClient.invalidateQueries({ queryKey: ['seller-products'] })
			setSelected(new Set())
			setConfirmBulkDelete(false)
			toast.success(
				action === 'delete'
					? 'Produtos eliminados'
					: action === 'activate'
						? 'Produtos activados'
						: 'Produtos pausados'
			)
		},
		onError: () => toast.error('Erro na acção em massa'),
	})

	const products = data?.products ?? []
	const total = data?.total ?? products.length
	const deletingProduct = products.find((p) => p.id === deletingId) ?? null
	const allSelected = products.length > 0 && selected.size === products.length

	const hasFilters =
		Boolean(deferredSearch) ||
		statusFilter !== 'all' ||
		categoryFilter !== 'all' ||
		Boolean(minPrice) ||
		Boolean(maxPrice)

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

	function clearFilters() {
		setSearch('')
		setStatusFilter('all')
		setCategoryFilter('all')
		setMinPrice('')
		setMaxPrice('')
		setShowPriceFilters(false)
	}

	function openPreview(product: SellerProduct) {
		setPreview(product)
		setPreviewImage(product.image)
	}

	if (isLoading) {
		return (
			<div className='space-y-5'>
				<div className='flex items-center justify-between gap-3'>
					<Skeleton className='h-5 w-32' />
					<div className='flex gap-2'>
						<Skeleton className='h-9 w-28 rounded-full' />
						<Skeleton className='h-9 w-36 rounded-full' />
					</div>
				</div>
				<Skeleton className='h-10 w-full max-w-md rounded-full' />
				<div className='overflow-hidden rounded-2xl border border-border/60'>
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className='flex items-center gap-4 border-b border-border/40 px-4 py-3 last:border-0'
						>
							<Skeleton className='size-4 rounded' />
							<Skeleton className='size-14 rounded-xl' />
							<div className='flex-1 space-y-2'>
								<Skeleton className='h-4 w-48' />
								<Skeleton className='h-3 w-28' />
							</div>
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className='relative min-w-0 max-w-full space-y-5'>
			{/* Toolbar — title lives in top bar */}
			<div className='flex flex-wrap items-center justify-between gap-3'>
				<p className='text-sm text-muted-foreground'>
					<span className='tabular-nums text-foreground'>
						{total}
					</span>{' '}
					{total === 1 ? 'produto' : 'produtos'}
					{isFetching && !isLoading ? (
						<span className='ml-1 opacity-60'>· a actualizar…</span>
					) : null}
				</p>
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

			{/* Status pills */}
			<div
				className='flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none'
				role='tablist'
				aria-label='Filtrar por estado'
			>
				{STATUS_OPTIONS.map((opt) => {
					const active = statusFilter === opt.value
					return (
						<button
							key={opt.value}
							type='button'
							role='tab'
							aria-selected={active}
							onClick={() => setStatusFilter(opt.value)}
							className={cn(
								'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
								active
									? 'bg-foreground text-background'
									: 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
							)}
						>
							{opt.label}
						</button>
					)
				})}
			</div>

			{/* Search + secondary filters */}
			<div className='flex flex-col gap-3'>
				<div className='flex flex-wrap items-center gap-2'>
					<div className='relative min-w-0 max-w-md flex-1 basis-full sm:basis-auto sm:min-w-48'>
						<Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							placeholder='Pesquisar por nome…'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='rounded-full pl-9 pr-9'
							aria-label='Pesquisar produtos'
						/>
						{search ? (
							<span className='absolute right-2 top-1/2 -translate-y-1/2'>
								<IconTooltipButton
									label='Limpar pesquisa'
									size='icon-sm'
									className='size-8 text-muted-foreground hover:text-foreground'
									onClick={() => setSearch('')}
								>
									<X className='size-4' />
								</IconTooltipButton>
							</span>
						) : null}
					</div>

					<Select
						value={categoryFilter}
						onValueChange={(v) => v && setCategoryFilter(v)}
					>
						<SelectTrigger className='w-40 rounded-full'>
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

					<Button
						type='button'
						variant={showPriceFilters ? 'secondary' : 'outline'}
						size='sm'
						className='rounded-full'
						aria-expanded={showPriceFilters}
						onClick={() => setShowPriceFilters((v) => !v)}
					>
						<SlidersHorizontal className='size-3.5' />
						Preço
					</Button>

					{hasFilters ? (
						<Button
							type='button'
							variant='ghost'
							size='sm'
							className='rounded-full text-muted-foreground'
							onClick={clearFilters}
						>
							Limpar
						</Button>
					) : null}
				</div>

				{showPriceFilters ? (
					<div className='flex flex-wrap items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2.5'>
						<span className='text-xs font-medium text-muted-foreground'>
							Intervalo (MZN)
						</span>
						<Input
							type='number'
							min={0}
							placeholder='Mín'
							value={minPrice}
							onChange={(e) => setMinPrice(e.target.value)}
							className='h-8 w-28 rounded-lg'
							aria-label='Preço mínimo'
						/>
						<span className='text-muted-foreground'>–</span>
						<Input
							type='number'
							min={0}
							placeholder='Máx'
							value={maxPrice}
							onChange={(e) => setMaxPrice(e.target.value)}
							className='h-8 w-28 rounded-lg'
							aria-label='Preço máximo'
						/>
					</div>
				) : null}
			</div>

			{/* List */}
			{products.length === 0 ? (
				<div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-20 text-center'>
					<div className='flex size-14 items-center justify-center rounded-2xl bg-background shadow-sm ring-1 ring-border/60'>
						<Package className='size-7 text-muted-foreground' />
					</div>
					<h2 className='mt-5 font-heading text-xl font-bold tracking-tight'>
						{hasFilters
							? 'Nenhum resultado'
							: 'A sua vitrine está vazia'}
					</h2>
					<p className='mt-1.5 max-w-sm text-sm text-muted-foreground'>
						{hasFilters
							? 'Ajuste os filtros ou limpe a pesquisa para ver mais produtos.'
							: 'Publique o primeiro produto para começar a vender no Zuka.'}
					</p>
					{hasFilters ? (
						<Button
							type='button'
							variant='outline'
							className='mt-6 rounded-full'
							onClick={clearFilters}
						>
							Limpar filtros
						</Button>
					) : (
						<Button
							className='mt-6 rounded-full'
							render={
								<Link href='/dashboard/seller/produtos/novo'>
									<Plus className='size-4' />
									Adicionar produto
								</Link>
							}
						/>
					)}
				</div>
			) : (
				<div className='overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]'>
					<div className='flex items-center gap-3 border-b border-border/50 bg-muted/20 px-4 py-2.5'>
						<input
							type='checkbox'
							checked={allSelected}
							onChange={toggleAll}
							className='size-4 rounded border-input accent-foreground'
							aria-label='Seleccionar todos'
						/>
						<span className='text-xs font-medium text-muted-foreground'>
							{selected.size > 0
								? `${selected.size} seleccionado${selected.size > 1 ? 's' : ''}`
								: 'Seleccionar'}
						</span>
					</div>

					<ul className='divide-y divide-border/40'>
						{products.map((product) => {
							const isSelected = selected.has(product.id)
							const isInactive =
								product.status?.toUpperCase() !== 'ACTIVE'

							return (
								<li
									key={product.id}
									className={cn(
										'group flex items-center gap-3 px-3 py-3 transition-colors duration-150 sm:gap-4 sm:px-4',
										isSelected
											? 'bg-primary/4'
											: 'hover:bg-muted/40',
										isInactive && !isSelected && 'opacity-75'
									)}
								>
									<input
										type='checkbox'
										checked={isSelected}
										onChange={() => toggleOne(product.id)}
										className='size-4 shrink-0 rounded border-input accent-foreground'
										aria-label={`Seleccionar ${product.name}`}
									/>

									<button
										type='button'
										onClick={() => openPreview(product)}
										className='relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 transition-transform duration-150 group-hover:scale-[1.02] sm:size-16'
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

									<button
										type='button'
										onClick={() => openPreview(product)}
										className='min-w-0 flex-1 text-left'
									>
										<p className='truncate font-medium leading-snug'>
											{product.name}
										</p>
										<div className='mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm'>
											<ProductPrice product={product} />
											{product.categoryName ? (
												<span className='truncate text-muted-foreground'>
													· {product.categoryName}
												</span>
											) : null}
										</div>
										<div className='mt-1.5 sm:hidden'>
											<StatusChip
												status={product.status}
											/>
										</div>
									</button>

									<div className='hidden sm:block'>
										<StatusChip status={product.status} />
									</div>

									<div className='flex shrink-0 items-center gap-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'>
										<IconAction
											label='Pré-visualizar'
											onClick={() =>
												openPreview(product)
											}
										>
											<Eye className='size-4' />
										</IconAction>
										<IconAction
											label='Editar'
											href={`/dashboard/seller/produtos/${product.id}/editar`}
										>
											<Pencil className='size-4' />
										</IconAction>
										<IconAction
											label='Eliminar'
											className='text-destructive hover:bg-destructive/10 hover:text-destructive'
											onClick={() =>
												setDeletingId(product.id)
											}
										>
											<Trash2 className='size-4' />
										</IconAction>
									</div>
								</li>
							)
						})}
					</ul>
				</div>
			)}

			{/* Sticky bulk bar */}
			{selected.size > 0 ? (
				<div className='sticky bottom-4 z-20'>
					<div className='flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-background/95 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm'>
						<p className='text-sm font-medium'>
							{selected.size} seleccionado
							{selected.size > 1 ? 's' : ''}
						</p>
						<div className='ml-auto flex flex-wrap items-center gap-1.5'>
							<Button
								variant='outline'
								size='sm'
								className='rounded-full'
								disabled={bulkMutation.isPending}
								onClick={() =>
									bulkMutation.mutate('activate')
								}
							>
								<Play className='size-3.5' />
								Activar
							</Button>
							<Button
								variant='outline'
								size='sm'
								className='rounded-full'
								disabled={bulkMutation.isPending}
								onClick={() =>
									bulkMutation.mutate('deactivate')
								}
							>
								<Pause className='size-3.5' />
								Pausar
							</Button>
							<Button
								variant='destructive'
								size='sm'
								className='rounded-full'
								disabled={bulkMutation.isPending}
								onClick={() => setConfirmBulkDelete(true)}
							>
								<Trash2 className='size-3.5' />
								Eliminar
							</Button>
							<Button
								variant='ghost'
								size='sm'
								className='rounded-full'
								onClick={() => setSelected(new Set())}
							>
								Cancelar
							</Button>
						</div>
					</div>
				</div>
			) : null}

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

			<DeleteProductDialog
				product={
					confirmBulkDelete
						? {
								id: 'bulk',
								name: `${selected.size} produto${selected.size > 1 ? 's' : ''}`,
								price: '',
								imageUrl: '',
							}
						: null
				}
				onOpenChange={(open) => {
					if (!open) setConfirmBulkDelete(false)
				}}
				onConfirm={() => bulkMutation.mutate('delete')}
				isDeleting={bulkMutation.isPending}
			/>

			{/* Preview sheet */}
			<Sheet
				open={Boolean(preview)}
				onOpenChange={(open) => {
					if (!open) {
						setPreview(null)
						setPreviewImage(null)
					}
				}}
			>
				<SheetContent
					side='right'
					className='flex w-full flex-col gap-0 p-0 sm:max-w-md'
				>
					{preview ? (
						<ProductPreviewPanel
							preview={preview}
							heroUrl={previewImage ?? preview.image}
							onSelectImage={setPreviewImage}
							onDelete={() => setDeletingId(preview.id)}
						/>
					) : null}
				</SheetContent>
			</Sheet>
		</div>
	)
}

function ProductPreviewPanel({
	preview,
	heroUrl,
	onSelectImage,
	onDelete,
}: {
	preview: SellerProduct
	heroUrl: string | null
	onSelectImage: (url: string) => void
	onDelete: () => void
}) {
	return (
		<>
			<SheetHeader className='border-b border-border/60 px-6 py-4'>
				<SheetTitle className='font-heading pr-8 text-left'>
					{preview.name}
				</SheetTitle>
				<SheetDescription className='text-left'>
					{preview.categoryName ?? 'Sem categoria'}
				</SheetDescription>
			</SheetHeader>

			<div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
				<div className='relative aspect-4/3 overflow-hidden rounded-2xl bg-muted ring-1 ring-border/50'>
					{heroUrl ? (
						<Image
							src={heroUrl}
							alt={preview.name}
							fill
							className='object-cover'
							sizes='440px'
							placeholder='blur'
							blurDataURL={BLUR_PLACEHOLDER}
						/>
					) : (
						<div className='flex size-full items-center justify-center'>
							<Package className='size-10 text-muted-foreground' />
						</div>
					)}
				</div>

				{preview.images?.length > 1 ? (
					<div className='flex gap-2 overflow-x-auto pb-1'>
						{preview.images.map((url) => (
							<button
								key={url}
								type='button'
								onClick={() => onSelectImage(url)}
								className={cn(
									'relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted ring-2 transition-shadow',
									heroUrl === url
										? 'ring-foreground'
										: 'ring-transparent hover:ring-border'
								)}
							>
								<Image
									src={url}
									alt=''
									fill
									className='object-cover'
									sizes='56px'
								/>
							</button>
						))}
					</div>
				) : null}

				<div className='flex flex-wrap items-center justify-between gap-2'>
					<div>
						{preview.discountPrice != null &&
						preview.discountPrice > 0 ? (
							<div className='flex items-baseline gap-2'>
								<p className='text-2xl font-bold tabular-nums tracking-tight text-primary'>
									{formatPrice(
										preview.discountPrice,
										preview.currency
									)}
								</p>
								<p className='text-sm text-muted-foreground line-through'>
									{formatPrice(
										preview.price,
										preview.currency
									)}
								</p>
							</div>
						) : (
							<p className='text-2xl font-bold tabular-nums tracking-tight text-primary'>
								{formatPrice(
									preview.price,
									preview.currency
								)}
							</p>
						)}
					</div>
					<StatusChip status={preview.status} />
				</div>

				{preview.description ? (
					<p className='whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground'>
						{preview.description}
					</p>
				) : (
					<p className='text-sm italic text-muted-foreground'>
						Sem descrição.
					</p>
				)}
			</div>

			<SheetFooter className='border-t border-border/60 px-6 py-4 sm:flex-row'>
				<Button
					className='flex-1 rounded-full'
					render={
						<Link
							href={`/dashboard/seller/produtos/${preview.id}/editar`}
						>
							<Pencil className='size-4' />
							Editar
						</Link>
					}
				/>
				<Button
					type='button'
					variant='outline'
					className='flex-1 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive'
					onClick={onDelete}
				>
					<Trash2 className='size-4' />
					Eliminar
				</Button>
			</SheetFooter>
		</>
	)
}
