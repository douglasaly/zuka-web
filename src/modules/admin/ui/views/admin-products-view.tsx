'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import {
	Eye,
	ExternalLink,
	Image as ImageIcon,
	Package,
	Pause,
	Play,
	Search,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'
import { ConfirmDialog } from '../components/confirm-dialog'
import { EmptyState } from '../components/empty-state'
import { StatusBadge } from '../components/status-badge'
import { TableSkeleton } from '../components/table-skeleton'

type Product = Record<string, unknown>

const STATUS_FILTERS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'ACTIVE', label: 'Activos' },
	{ value: 'INACTIVE', label: 'Pausados' },
	{ value: 'DRAFT', label: 'Rascunhos' },
	{ value: 'PENDING_REVIEW', label: 'Em revisão' },
] as const

const PRODUCT_STATUS_LABELS: Record<string, string> = {
	ACTIVE: 'Activo',
	INACTIVE: 'Pausado',
	DRAFT: 'Rascunho',
	PENDING_REVIEW: 'Em revisão',
	ARCHIVED: 'Arquivado',
}

async function fetchProducts(search: string, status: string) {
	const params = new URLSearchParams()
	if (search) params.set('search', search)
	if (status !== 'all') params.set('status', status)
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

function getThumb(product: Product): string | undefined {
	const imgs = product.product_images as
		| Array<{ url?: string; is_primary?: boolean }>
		| undefined
	return (
		imgs?.find((i) => i.is_primary)?.url ?? imgs?.[0]?.url ?? undefined
	)
}

function productStatus(product: Product): string {
	return (product.status as string) || (product.is_visible ? 'ACTIVE' : 'INACTIVE')
}

function IconAction({
	label,
	onClick,
	className,
	destructive,
	children,
}: {
	label: string
	onClick: () => void
	className?: string
	destructive?: boolean
	children: React.ReactNode
}) {
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button
						type='button'
						variant='ghost'
						size='icon-sm'
						aria-label={label}
						className={cn(
							destructive &&
								'text-destructive hover:bg-destructive/10 hover:text-destructive',
							className
						)}
						onClick={onClick}
					>
						{children}
					</Button>
				}
			/>
			<TooltipContent>{label}</TooltipContent>
		</Tooltip>
	)
}

export function AdminProductsView() {
	const [search, setSearch] = useState('')
	const [status, setStatus] = useState('all')
	const deferredSearch = useDeferredValue(search.trim())
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
	const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
	const [preview, setPreview] = useState<Product | null>(null)
	const qc = useQueryClient()

	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['admin-products', deferredSearch, status],
		queryFn: () => fetchProducts(deferredSearch, status),
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
			if (preview?.id === vars.id) {
				setPreview((prev) =>
					prev
						? {
								...prev,
								is_visible: vars.body.is_visible,
								status:
									vars.body.is_visible === false
										? 'INACTIVE'
										: 'ACTIVE',
							}
						: prev
				)
			}
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const deleteMutation = useMutation({
		mutationFn: async (ids: string[]) => {
			await Promise.all(ids.map((id) => deleteProduct(id)))
			return ids
		},
		onSuccess: (ids) => {
			toast.success(
				ids.length > 1
					? `${ids.length} produtos eliminados`
					: 'Produto eliminado'
			)
			setConfirmDelete(null)
			setConfirmBulkDelete(false)
			setSelected(new Set())
			if (preview && ids.includes(preview.id as string)) {
				setPreview(null)
			}
			qc.invalidateQueries({ queryKey: ['admin-products'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const products: Product[] = data?.products ?? []
	const hasFilters = Boolean(deferredSearch) || status !== 'all'

	function toggleSelect(id: string) {
		setSelected((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	function toggleSelectAll() {
		if (selected.size === products.length) {
			setSelected(new Set())
			return
		}
		setSelected(new Set(products.map((p) => p.id as string)))
	}

	function pauseSelected() {
		for (const id of selected) {
			patchMutation.mutate({ id, body: { is_visible: false } })
		}
		setSelected(new Set())
	}

	return (
		<div className='space-y-4'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<p className='text-sm text-muted-foreground'>
						Moderar anúncios do marketplace
						{!isLoading ? (
							<>
								{' '}
								·{' '}
								<span className='tabular-nums text-foreground'>
									{products.length}
								</span>{' '}
								{products.length === 1
									? 'produto'
									: 'produtos'}
								{isFetching ? '…' : ''}
							</>
						) : null}
					</p>
				</div>
			</div>

			<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
				<div className='relative min-w-0 flex-1 sm:max-w-sm'>
					<Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder='Pesquisar por nome…'
						className='pl-9 pr-9'
						aria-label='Pesquisar produtos'
					/>
					{search ? (
						<span className='absolute right-1.5 top-1/2 -translate-y-1/2'>
							<Tooltip>
								<TooltipTrigger
									render={
										<button
											type='button'
											aria-label='Limpar pesquisa'
											className='rounded-md p-1.5 text-muted-foreground hover:text-foreground'
											onClick={() => setSearch('')}
										>
											<X className='size-4' />
										</button>
									}
								/>
								<TooltipContent>Limpar pesquisa</TooltipContent>
							</Tooltip>
						</span>
					) : null}
				</div>

				<Select
					value={status}
					onValueChange={(v) => v && setStatus(v)}
				>
					<SelectTrigger className='w-full sm:w-44' size='default'>
						<SelectValue placeholder='Estado' />
					</SelectTrigger>
					<SelectContent>
						{STATUS_FILTERS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{hasFilters ? (
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='self-start sm:self-auto'
						onClick={() => {
							setSearch('')
							setStatus('all')
						}}
					>
						Limpar filtros
					</Button>
				) : null}
			</div>

			{selected.size > 0 ? (
				<div className='flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 sm:px-4'>
					<span className='text-xs font-medium text-muted-foreground'>
						{selected.size} seleccionado
						{selected.size > 1 ? 's' : ''}
					</span>
					<div className='ml-auto flex flex-wrap items-center gap-1.5'>
						<Button
							size='sm'
							variant='outline'
							type='button'
							onClick={pauseSelected}
							disabled={patchMutation.isPending}
						>
							<Pause className='size-3.5' />
							Pausar
						</Button>
						<Button
							size='sm'
							variant='destructive'
							type='button'
							onClick={() => setConfirmBulkDelete(true)}
							disabled={deleteMutation.isPending}
						>
							<Trash2 className='size-3.5' />
							Eliminar
						</Button>
						<Button
							size='sm'
							variant='ghost'
							type='button'
							onClick={() => setSelected(new Set())}
						>
							Cancelar
						</Button>
					</div>
				</div>
			) : null}

			{isLoading ? (
				<TableSkeleton rows={8} cols={7} />
			) : products.length === 0 ? (
				<EmptyState
					icon={Package}
					message={
						hasFilters
							? 'Nenhum produto corresponde aos filtros.'
							: 'Nenhum produto encontrado.'
					}
				/>
			) : (
				<div className='overflow-hidden rounded-2xl border border-border/60 bg-card'>
					<Table>
						<TableHeader>
							<TableRow className='hover:bg-transparent'>
								<TableHead className='w-10'>
									<input
										type='checkbox'
										className='size-4 accent-primary'
										checked={
											selected.size === products.length &&
											products.length > 0
										}
										onChange={toggleSelectAll}
										aria-label='Seleccionar todos'
									/>
								</TableHead>
								<TableHead>Produto</TableHead>
								<TableHead className='hidden md:table-cell'>
									Loja
								</TableHead>
								<TableHead className='hidden lg:table-cell'>
									Categoria
								</TableHead>
								<TableHead>Preço</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead className='hidden xl:table-cell'>
									Criado
								</TableHead>
								<TableHead className='w-[1%] text-right'>
									<span className='sr-only'>Acções</span>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{products.map((product) => {
								const id = product.id as string
								const thumb = getThumb(product)
								const store = product.stores as
									| Record<string, unknown>
									| null
								const cat = product.categories as
									| Record<string, unknown>
									| null
								const statusKey = productStatus(product)
								const visible = Boolean(product.is_visible)

								return (
									<TableRow
										key={id}
										data-state={
											selected.has(id)
												? 'selected'
												: undefined
										}
										className='group'
									>
										<TableCell>
											<input
												type='checkbox'
												className='size-4 accent-primary'
												checked={selected.has(id)}
												onChange={() =>
													toggleSelect(id)
												}
												aria-label={`Seleccionar ${product.name as string}`}
											/>
										</TableCell>
										<TableCell>
											<button
												type='button'
												onClick={() =>
													setPreview(product)
												}
												className='flex max-w-xs items-center gap-3 text-left'
											>
												{thumb ? (
													<div className='relative size-10 shrink-0 overflow-hidden rounded-lg border border-border/60'>
														<Image
															src={thumb}
															alt=''
															fill
															sizes='40px'
															placeholder='blur'
															blurDataURL={
																BLUR_PLACEHOLDER
															}
															className='object-cover'
														/>
													</div>
												) : (
													<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted'>
														<ImageIcon className='size-4 text-muted-foreground' />
													</div>
												)}
												<span className='line-clamp-2 text-sm font-medium group-hover:underline'>
													{product.name as string}
												</span>
											</button>
										</TableCell>
										<TableCell className='hidden md:table-cell'>
											{store ? (
												<Link
													href={`/admin/stores/${store.id as string}`}
													className='text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline'
												>
													{store.name as string}
												</Link>
											) : (
												<span className='text-muted-foreground'>
													—
												</span>
											)}
										</TableCell>
										<TableCell className='hidden text-sm text-muted-foreground lg:table-cell'>
											{(cat?.name as string) ?? '—'}
										</TableCell>
										<TableCell className='whitespace-nowrap text-sm font-medium tabular-nums'>
											{product.price != null
												? formatPrice(
														Number(product.price),
														(product.currency as string) ??
															'MZN'
													)
												: '—'}
										</TableCell>
										<TableCell>
											<StatusBadge
												status={statusKey}
												label={
													PRODUCT_STATUS_LABELS[
														statusKey
													]
												}
											/>
										</TableCell>
										<TableCell className='hidden whitespace-nowrap text-xs text-muted-foreground xl:table-cell'>
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
											<div className='flex items-center justify-end gap-0.5'>
												<IconAction
													label='Ver detalhes'
													onClick={() =>
														setPreview(product)
													}
												>
													<Eye className='size-3.5' />
												</IconAction>
												{visible ? (
													<IconAction
														label='Pausar'
														className='text-amber-600 hover:bg-amber-500/10 hover:text-amber-700'
														onClick={() =>
															patchMutation.mutate(
																{
																	id,
																	body: {
																		is_visible: false,
																	},
																}
															)
														}
													>
														<Pause className='size-3.5' />
													</IconAction>
												) : (
													<IconAction
														label='Reactivar'
														className='text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700'
														onClick={() =>
															patchMutation.mutate(
																{
																	id,
																	body: {
																		is_visible: true,
																	},
																}
															)
														}
													>
														<Play className='size-3.5' />
													</IconAction>
												)}
												<IconAction
													label='Eliminar'
													destructive
													onClick={() =>
														setConfirmDelete(id)
													}
												>
													<Trash2 className='size-3.5' />
												</IconAction>
											</div>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</div>
			)}

			<Sheet
				open={Boolean(preview)}
				onOpenChange={(open) => !open && setPreview(null)}
			>
				<SheetContent
					side='right'
					className='flex w-full flex-col sm:max-w-md'
				>
					{preview ? (
						<>
							<SheetHeader className='border-b border-border/60 pb-4'>
								<SheetTitle className='font-heading pr-8 text-left'>
									{preview.name as string}
								</SheetTitle>
								<SheetDescription className='text-left'>
									{(
										preview.categories as
											| Record<string, unknown>
											| null
									)?.name
										? String(
												(
													preview.categories as Record<
														string,
														unknown
													>
												).name
											)
										: 'Sem categoria'}
								</SheetDescription>
							</SheetHeader>

							<div className='flex-1 space-y-5 overflow-y-auto py-4'>
								<div className='flex gap-2 overflow-x-auto pb-1'>
									{(
										(preview.product_images ??
											[]) as Array<{ url?: string }>
									).length > 0 ? (
										(
											(preview.product_images ??
												[]) as Array<{ url?: string }>
										).map((img, i) =>
											img.url ? (
												<div
													key={`${img.url}-${i}`}
													className='relative h-40 w-40 shrink-0 overflow-hidden rounded-xl border border-border/60'
												>
													<Image
														src={img.url}
														alt=''
														fill
														sizes='160px'
														placeholder='blur'
														blurDataURL={
															BLUR_PLACEHOLDER
														}
														className='object-cover'
													/>
												</div>
											) : null
										)
									) : (
										<div className='flex h-40 w-full items-center justify-center rounded-xl bg-muted'>
											<ImageIcon className='size-8 text-muted-foreground' />
										</div>
									)}
								</div>

								<div className='flex flex-wrap items-center justify-between gap-2'>
									<p className='text-2xl font-bold tabular-nums tracking-tight'>
										{preview.price != null
											? formatPrice(
													Number(preview.price),
													(preview.currency as string) ??
														'MZN'
												)
											: '—'}
									</p>
									<StatusBadge
										status={productStatus(preview)}
										label={
											PRODUCT_STATUS_LABELS[
												productStatus(preview)
											]
										}
									/>
								</div>

								{preview.description ? (
									<p className='whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground'>
										{String(preview.description)}
									</p>
								) : (
									<p className='text-sm italic text-muted-foreground'>
										Sem descrição.
									</p>
								)}

								{(
									preview.stores as
										| Record<string, unknown>
										| null
								)?.name ? (
									<Link
										href={`/admin/stores/${
											(
												preview.stores as Record<
													string,
													unknown
												>
											).id as string
										}`}
										className='inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline'
									>
										{
											(
												preview.stores as Record<
													string,
													unknown
												>
											).name as string
										}
										<ExternalLink className='size-3.5' />
									</Link>
								) : null}

								{preview.created_at ? (
									<p className='text-xs text-muted-foreground'>
										Criado em{' '}
										{format(
											new Date(
												preview.created_at as string
											),
											"d 'de' MMMM yyyy",
											{ locale: pt }
										)}
									</p>
								) : null}
							</div>

							<SheetFooter className='border-t border-border/60 pt-4 sm:flex-row'>
								{preview.is_visible ? (
									<Button
										type='button'
										variant='outline'
										className='flex-1'
										onClick={() =>
											patchMutation.mutate({
												id: preview.id as string,
												body: { is_visible: false },
											})
										}
									>
										<Pause className='size-3.5' />
										Pausar
									</Button>
								) : (
									<Button
										type='button'
										variant='outline'
										className='flex-1'
										onClick={() =>
											patchMutation.mutate({
												id: preview.id as string,
												body: { is_visible: true },
											})
										}
									>
										<Play className='size-3.5' />
										Reactivar
									</Button>
								)}
								<Button
									type='button'
									variant='destructive'
									className='flex-1'
									onClick={() =>
										setConfirmDelete(preview.id as string)
									}
								>
									<Trash2 className='size-3.5' />
									Eliminar
								</Button>
							</SheetFooter>
						</>
					) : null}
				</SheetContent>
			</Sheet>

			<ConfirmDialog
				open={Boolean(confirmDelete)}
				onOpenChange={(open) => !open && setConfirmDelete(null)}
				title='Eliminar produto'
				description='Esta acção é irreversível. O produto será eliminado permanentemente.'
				confirmLabel='Eliminar'
				loading={deleteMutation.isPending}
				onConfirm={() =>
					confirmDelete && deleteMutation.mutate([confirmDelete])
				}
			/>

			<ConfirmDialog
				open={confirmBulkDelete}
				onOpenChange={setConfirmBulkDelete}
				title={`Eliminar ${selected.size} produto${selected.size > 1 ? 's' : ''}?`}
				description='Esta acção é irreversível. Os produtos seleccionados serão eliminados permanentemente.'
				confirmLabel='Eliminar'
				loading={deleteMutation.isPending}
				onConfirm={() =>
					deleteMutation.mutate(Array.from(selected))
				}
			/>
		</div>
	)
}
