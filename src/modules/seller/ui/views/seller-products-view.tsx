'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Package, Plus, Search, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'

type Product = {
	id: string
	name: string
	price: number
	discountPrice: number | null
	currency: string
	status: string
	isVisible: boolean
	categoryName: string | null
	image: string | null
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
	active: { label: 'Activo', color: 'bg-emerald-500/10 text-emerald-600' },
	inactive: {
		label: 'Inactivo',
		color: 'bg-amber-500/10 text-amber-600',
	},
	draft: { label: 'Rascunho', color: 'bg-muted text-muted-foreground' },
}

const STATUS_OPTIONS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'active', label: 'Activos' },
	{ value: 'inactive', label: 'Inactivos' },
	{ value: 'draft', label: 'Rascunhos' },
]

export const SellerProductsView = () => {
	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [categoryFilter, setCategoryFilter] = useState('all')
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const queryClient = useQueryClient()

	const queryParams = new URLSearchParams()
	if (statusFilter !== 'all') queryParams.set('status', statusFilter)
	if (categoryFilter !== 'all') queryParams.set('category', categoryFilter)
	if (search) queryParams.set('search', search)

	const { data, isLoading } = useQuery<{ products: Product[] }>({
		queryKey: ['seller-products', statusFilter, categoryFilter, search],
		queryFn: async () => {
			const qs = queryParams.toString()
			const url = `/api/seller/products${qs ? `?${qs}` : ''}`
			const res = await fetch(url)
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
			const items = json.data ?? json
			if (Array.isArray(items)) return items
			return []
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
		},
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
		},
	})

	const products = data?.products ?? []

	const filtered = useMemo(() => {
		return products
	}, [products])

	const allFilteredSelected =
		filtered.length > 0 && selected.size === filtered.length

	function toggleAll() {
		if (allFilteredSelected) {
			setSelected(new Set())
		} else {
			setSelected(new Set(filtered.map((p) => p.id)))
		}
	}

	function toggleOne(id: string) {
		const next = new Set(selected)
		if (next.has(id)) next.delete(id)
		else next.add(id)
		setSelected(next)
	}

	if (isLoading) {
		return (
			<div className='space-y-3'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4'
					>
						<Skeleton className='size-14 rounded-lg' />
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
		<div className='space-y-4'>
			<div className='flex items-center justify-between gap-4'>
				<p className='text-sm text-muted-foreground'>
					{filtered.length}{' '}
					{filtered.length === 1 ? 'produto' : 'produtos'}
					{filtered.length !== products.length &&
						` (${products.length} total)`}
				</p>
				<Button
					className='rounded-full'
					render={
						<Link href='/dashboard/seller/produtos/novo'>
							<Plus className='mr-1 size-4' />
							Novo produto
						</Link>
					}
				/>
			</div>

			<div className='flex flex-wrap items-center gap-2'>
				<div className='relative flex-1 min-w-50 max-w-sm'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Pesquisar produtos...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className='pl-9 pr-9'
					/>
					{search && (
						<button
							type='button'
							onClick={() => setSearch('')}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
						>
							<X className='size-4' />
						</button>
					)}
				</div>
				<Select
					value={statusFilter}
					onValueChange={(v) => v && setStatusFilter(v)}
				>
					<SelectTrigger className='w-35'>
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
							<SelectItem key={cat.id} value={cat.name}>
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{selected.size > 0 && (
				<div className='flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-2'>
					<span className='text-sm font-medium'>
						{selected.size} seleccionado
						{selected.size > 1 ? 's' : ''}
					</span>
					<div className='ml-auto flex items-center gap-1'>
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
							Desactivar
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
			)}

			{filtered.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-24 text-center'>
					<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
						<Package className='size-8 text-muted-foreground' />
					</div>
					<h2 className='mt-4 font-heading text-xl font-bold'>
						{search ||
						statusFilter !== 'all' ||
						categoryFilter !== 'all'
							? 'Nenhum resultado'
							: 'Nenhum produto ainda'}
					</h2>
					<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
						{search ||
						statusFilter !== 'all' ||
						categoryFilter !== 'all'
							? 'Tente ajustar os filtros ou a pesquisa.'
							: 'Adicione o primeiro produto da sua loja.'}
					</p>
					{!search &&
						statusFilter === 'all' &&
						categoryFilter === 'all' && (
							<Button
								className='mt-6 rounded-full'
								render={
									<Link href='/dashboard/seller/produtos/novo'>
										<Plus className='mr-1 size-4' />
										Adicionar produto
									</Link>
								}
							/>
						)}
				</div>
			) : (
				<div className='space-y-2'>
					<div className='flex items-center gap-2 border-b pb-2'>
						<input
							type='checkbox'
							checked={allFilteredSelected}
							onChange={toggleAll}
							className='size-4 rounded border-gray-300'
						/>
						<span className='text-xs text-muted-foreground'>
							Seleccionar todos
						</span>
					</div>
					{filtered.map((product) => {
						const statusConfig = STATUS_MAP[product.status] ?? {
							label: product.status,
							color: 'bg-muted text-muted-foreground',
						}

						return (
							<div
								key={product.id}
								className={cn(
									'flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/50',
									product.status !== 'active' && 'opacity-70',
									selected.has(product.id) &&
										'border-primary/50 bg-primary/5'
								)}
							>
								<input
									type='checkbox'
									checked={selected.has(product.id)}
									onChange={() => toggleOne(product.id)}
									className='size-4 rounded border-gray-300'
								/>
								<div className='relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted'>
									{product.image ? (
										<Image
											src={product.image}
											alt={product.name}
											fill
											className='object-cover'
											sizes='56px'
											placeholder='blur'
											blurDataURL={BLUR_PLACEHOLDER}
										/>
									) : (
										<div className='flex size-full items-center justify-center'>
											<Package className='size-5 text-muted-foreground' />
										</div>
									)}
								</div>

								<div className='flex-1 min-w-0'>
									<p className='truncate font-medium'>
										{product.name}
									</p>
									<div className='mt-0.5 flex items-center gap-2 text-sm'>
										<span className='font-medium text-primary'>
											{formatPrice(
												product.price,
												product.currency
											)}
										</span>
										{product.categoryName && (
											<>
												<span className='text-muted-foreground'>
													&middot;
												</span>
												<span className='text-muted-foreground'>
													{product.categoryName}
												</span>
											</>
										)}
									</div>
								</div>

								<span
									className={`hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline ${statusConfig.color}`}
								>
									{statusConfig.label}
								</span>

								<div className='flex items-center gap-1'>
									<Button
										variant='ghost'
										size='sm'
										className='rounded-full text-xs'
										render={
											<Link
												href={`/dashboard/seller/produtos/${product.id}/editar`}
											>
												Editar
											</Link>
										}
									/>
									<Button
										variant='ghost'
										size='sm'
										className='rounded-full text-xs text-destructive hover:text-destructive'
										onClick={() =>
											setDeletingId(product.id)
										}
										disabled={deleteMutation.isPending}
									>
										{deletingId === product.id &&
										deleteMutation.isPending
											? 'A eliminar…'
											: 'Eliminar'}
									</Button>
								</div>
							</div>
						)
					})}
				</div>
			)}

			{deletingId && !deleteMutation.isPending && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
					<div className='mx-4 w-full max-w-sm rounded-2xl border bg-card p-6 shadow-lg'>
						<div className='flex items-center gap-3'>
							<div className='flex size-10 items-center justify-center rounded-full bg-destructive/10'>
								<AlertCircle className='size-5 text-destructive' />
							</div>
							<div>
								<p className='font-medium'>Eliminar produto</p>
								<p className='text-sm text-muted-foreground'>
									Tem a certeza? Esta acção não pode ser
									desfeita.
								</p>
							</div>
						</div>
						<div className='mt-4 flex justify-end gap-2'>
							<Button
								variant='outline'
								size='sm'
								className='rounded-full'
								onClick={() => setDeletingId(null)}
							>
								Cancelar
							</Button>
							<Button
								variant='destructive'
								size='sm'
								className='rounded-full'
								onClick={() =>
									deletingId &&
									deleteMutation.mutate(deletingId)
								}
							>
								Eliminar
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
