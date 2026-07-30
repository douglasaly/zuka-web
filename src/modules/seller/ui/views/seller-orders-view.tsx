'use client'

/**
 * THESIS: Orders as a full-bleed fulfillment workbench — Table on desktop,
 * stacked rows on mobile; traditional numbered pagination in the URL.
 * OWN-WORLD: Seller Operate + shadcn Table/Badge/AlertDialog/Pagination.
 * STORY: Filter → page → confirm delivery → status advances.
 * FIRST VIEWPORT: Toolbar + full-width list + footer pager.
 * FORM: Polish of existing orders Operate surface (no new visual world).
 */

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import {
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Ellipsis,
	Loader2,
	Package,
	Search,
	ShoppingBag,
	Truck,
	X,
	XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
	useDeferredValue,
	useEffect,
	useMemo,
	useState,
	useTransition,
} from 'react'
import { toast } from 'sonner'
import { OrderStatusBadge } from '@/components/order-status-badge'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
} from '@/components/ui/pagination'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import type { OrderStatus } from '@/lib/orders/status-transitions'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'
import { IconTooltipButton } from '../components/icon-tooltip-button'
import {
	type OrderSheetPendingAction,
	SellerOrderDetailSheetContent,
} from '../components/seller-order-detail-sheet'
import { useSetSellerPageMeta } from '../layouts/seller-page-meta'

type ReviewState = 'none' | 'awaiting' | 'done'

type SellerOrder = {
	id: string
	shortId: string
	customerName: string
	customerEmail: string | null
	itemsSummary: string
	itemCount: number
	total: number
	currency: string
	status: OrderStatus
	statusLabel: string
	date: string
	reviewEligible: boolean
	reviewState: ReviewState
	allowedActions: {
		markShipping: boolean
		markCompleted: boolean
		cancel: boolean
	}
}

type OrdersResponse = {
	orders: SellerOrder[]
	total: number
	page: number
	perPage: number
	totalPages: number
	hasMore: boolean
}

type PendingAction = OrderSheetPendingAction

const STATUS_OPTIONS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'PENDING', label: 'Pendentes' },
	{ value: 'SHIPPING', label: 'Em envio' },
	{ value: 'COMPLETED', label: 'Entregues' },
	{ value: 'CANCELLED', label: 'Cancelados' },
] as const

const DATE_OPTIONS = [
	{ value: 'all', label: 'Todo o período' },
	{ value: '7', label: 'Últimos 7 dias' },
	{ value: '30', label: 'Últimos 30 dias' },
	{ value: '90', label: 'Últimos 90 dias' },
] as const

const PER_PAGE_OPTIONS = [10, 25, 50, 100] as const
const DEFAULT_PER_PAGE = 10

function ReviewBadge({ state }: { state: ReviewState }) {
	if (state === 'awaiting') {
		return (
			<Badge
				variant='secondary'
				className='bg-amber-500/10 text-amber-800 dark:text-amber-300'
			>
				Aguardando avaliação
			</Badge>
		)
	}
	if (state === 'done') {
		return (
			<Badge
				variant='secondary'
				className='bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
			>
				Avaliado
			</Badge>
		)
	}
	return null
}

function formatOrderDate(iso: string) {
	return new Date(iso).toLocaleDateString('pt-PT', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
}

function confirmCopy(action: PendingAction) {
	switch (action.nextStatus) {
		case 'SHIPPING':
			return {
				title: `Marcar pedido #${action.shortId} como em envio?`,
				description:
					'O cliente será notificado de que o pedido está a caminho. Depois poderá marcar como entregue.',
				confirmLabel: 'Confirmar envio',
				success: 'Pedido em envio. O cliente foi notificado.',
				destructive: false,
			}
		case 'COMPLETED':
			return {
				title: `Confirmar que o pedido #${action.shortId} foi entregue?`,
				description:
					'Esta acção não pode ser anulada. O cliente poderá avaliar a loja e os produtos.',
				confirmLabel: 'Marcar como entregue',
				success:
					'Pedido marcado como entregue. O cliente foi notificado.',
				destructive: false,
			}
		case 'CANCELLED':
			return {
				title: `Cancelar pedido #${action.shortId}?`,
				description:
					'O cliente será notificado. Pedidos cancelados não podem ser reactivados.',
				confirmLabel: 'Cancelar pedido',
				success: 'Pedido cancelado. O cliente foi notificado.',
				destructive: true,
			}
	}
}

function buildPageList(
	current: number,
	totalPages: number
): Array<number | 'ellipsis'> {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1)
	}
	const pages = new Set<number>()
	pages.add(1)
	pages.add(totalPages)
	for (let p = current - 1; p <= current + 1; p++) {
		if (p >= 1 && p <= totalPages) pages.add(p)
	}
	const sorted = [...pages].sort((a, b) => a - b)
	const result: Array<number | 'ellipsis'> = []
	for (let i = 0; i < sorted.length; i++) {
		if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('ellipsis')
		result.push(sorted[i])
	}
	return result
}

function OrderActionsMenu({
	order,
	onAction,
	onOpen,
}: {
	order: SellerOrder
	onAction: (action: PendingAction) => void
	onOpen: () => void
}) {
	const hasStatusAction =
		order.allowedActions.markCompleted ||
		order.allowedActions.markShipping ||
		order.allowedActions.cancel

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant='ghost'
						size='icon-sm'
						className='rounded-full'
						aria-label={`Acções do pedido ${order.shortId}`}
					/>
				}
			>
				<Ellipsis className='size-4' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='min-w-48'>
				<DropdownMenuItem onClick={onOpen}>
					<Package className='size-4' />
					Ver detalhe
				</DropdownMenuItem>
				{hasStatusAction ? <DropdownMenuSeparator /> : null}
				{order.allowedActions.markCompleted ? (
					<DropdownMenuItem
						onClick={() =>
							onAction({
								orderId: order.id,
								shortId: order.shortId,
								nextStatus: 'COMPLETED',
							})
						}
					>
						<CheckCircle2 className='size-4' />
						Marcar como entregue
					</DropdownMenuItem>
				) : null}
				{order.allowedActions.markShipping ? (
					<DropdownMenuItem
						onClick={() =>
							onAction({
								orderId: order.id,
								shortId: order.shortId,
								nextStatus: 'SHIPPING',
							})
						}
					>
						<Truck className='size-4' />
						Marcar como em envio
					</DropdownMenuItem>
				) : null}
				{order.allowedActions.cancel ? (
					<DropdownMenuItem
						variant='destructive'
						onClick={() =>
							onAction({
								orderId: order.id,
								shortId: order.shortId,
								nextStatus: 'CANCELLED',
							})
						}
					>
						<XCircle className='size-4' />
						Cancelar pedido
					</DropdownMenuItem>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function OrdersTableSkeleton() {
	return (
		<div className='w-full min-w-0 space-y-4'>
			<div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
				<Skeleton className='h-10 w-full rounded-full sm:max-w-sm' />
				<div className='flex gap-2'>
					<Skeleton className='h-10 w-36 rounded-full' />
					<Skeleton className='h-10 w-40 rounded-full' />
				</div>
			</div>
			<Skeleton className='h-4 w-48' />
			<div className='overflow-hidden rounded-xl border border-border'>
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-4 border-b border-border px-4 py-4 last:border-0'
					>
						<div className='min-w-0 flex-1 space-y-2'>
							<Skeleton className='h-4 w-28' />
							<Skeleton className='h-3 w-48 max-w-full' />
						</div>
						<Skeleton className='h-5 w-20 rounded-full' />
					</div>
				))}
			</div>
		</div>
	)
}

function parsePerPage(raw: string | null): number {
	const n = Number(raw ?? DEFAULT_PER_PAGE)
	return PER_PAGE_OPTIONS.includes(n as (typeof PER_PAGE_OPTIONS)[number])
		? n
		: DEFAULT_PER_PAGE
}

export const SellerOrdersView = () => {
	useSetSellerPageMeta({
		title: 'Pedidos',
		crumbs: ['Dashboard', 'Pedidos'],
	})

	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [, startTransition] = useTransition()
	const queryClient = useQueryClient()

	const page = Math.max(Number(searchParams.get('page')) || 1, 1)
	const perPage = parsePerPage(searchParams.get('perPage'))
	const statusFilter = searchParams.get('status') ?? 'all'
	const dateFilter = searchParams.get('date') ?? 'all'
	const searchFromUrl = searchParams.get('q') ?? ''

	const [searchInput, setSearchInput] = useState(searchFromUrl)
	const deferredSearch = useDeferredValue(searchInput)
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [pendingAction, setPendingAction] = useState<PendingAction | null>(
		null
	)

	useEffect(() => {
		setSearchInput(searchFromUrl)
	}, [searchFromUrl])

	function replaceParams(
		patch: Record<string, string | null>,
		options?: { resetPage?: boolean }
	) {
		const next = new URLSearchParams(searchParams.toString())
		for (const [key, value] of Object.entries(patch)) {
			if (value == null || value === '' || value === 'all') {
				next.delete(key)
			} else {
				next.set(key, value)
			}
		}
		if (options?.resetPage) {
			next.delete('page')
		}
		if (!next.get('perPage') || next.get('perPage') === String(DEFAULT_PER_PAGE)) {
			// keep default out of URL when it's 25? User asked for URL reflection —
			// always set perPage when not default to keep URLs clean; always set page when > 1
			if (next.get('perPage') === String(DEFAULT_PER_PAGE)) {
				next.delete('perPage')
			}
		}
		const qs = next.toString()
		startTransition(() => {
			router.replace(qs ? `${pathname}?${qs}` : pathname, {
				scroll: false,
			})
		})
	}

	// Sync deferred search → URL (resets page). Keep filters.
	useEffect(() => {
		const trimmed = deferredSearch.trim()
		const current = searchParams.get('q') ?? ''
		if (trimmed === current) return
		const next = new URLSearchParams(searchParams.toString())
		if (trimmed) next.set('q', trimmed)
		else next.delete('q')
		next.delete('page')
		const qs = next.toString()
		startTransition(() => {
			router.replace(qs ? `${pathname}?${qs}` : pathname, {
				scroll: false,
			})
		})
	}, [deferredSearch, searchParams, pathname, router])

	const apiParams = useMemo(() => {
		const p = new URLSearchParams()
		p.set('page', String(page))
		p.set('perPage', String(perPage))
		if (statusFilter !== 'all') p.set('status', statusFilter)
		if (dateFilter !== 'all') p.set('date', dateFilter)
		if (searchFromUrl.trim()) p.set('search', searchFromUrl.trim())
		return p.toString()
	}, [page, perPage, statusFilter, dateFilter, searchFromUrl])

	const { data, isLoading, isError, isFetching, refetch } =
		useQuery<OrdersResponse>({
			queryKey: ['seller-orders', apiParams],
			queryFn: async () => {
				const res = await fetch(`/api/seller/orders?${apiParams}`)
				if (!res.ok) throw new Error('Failed to load orders')
				return res.json()
			},
			placeholderData: keepPreviousData,
		})

	const statusMutation = useMutation({
		mutationFn: async (action: PendingAction) => {
			const res = await fetch(`/api/seller/orders/${action.orderId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: action.nextStatus }),
			})
			const json = await res.json()
			if (!res.ok) {
				throw new Error(
					json.error ?? 'Não foi possível actualizar o pedido'
				)
			}
			return { action, order: json.order }
		},
		onMutate: async (action) => {
			await queryClient.cancelQueries({ queryKey: ['seller-orders'] })
			const previous = queryClient.getQueriesData<OrdersResponse>({
				queryKey: ['seller-orders'],
			})

			queryClient.setQueriesData<OrdersResponse>(
				{ queryKey: ['seller-orders'] },
				(old) => {
					if (!old?.orders) return old
					return {
						...old,
						orders: old.orders.map((o) => {
							if (o.id !== action.orderId) return o
							const status = action.nextStatus
							const labels = {
								SHIPPING: 'Em envio',
								COMPLETED: 'Entregue',
								CANCELLED: 'Cancelado',
							} as const
							return {
								...o,
								status,
								statusLabel: labels[status],
								reviewState:
									status === 'COMPLETED'
										? ('awaiting' as const)
										: o.reviewState,
								reviewEligible: status === 'COMPLETED',
								allowedActions: {
									markShipping: false,
									markCompleted: false,
									cancel: false,
								},
							}
						}),
					}
				}
			)

			return { previous }
		},
		onError: (error: Error, action, context) => {
			if (context?.previous) {
				for (const [key, value] of context.previous) {
					queryClient.setQueryData(key, value)
				}
			}
			toast.error(error.message, {
				action: {
					label: 'Tentar novamente',
					onClick: () => statusMutation.mutate(action),
				},
			})
		},
		onSuccess: ({ action }) => {
			toast.success(confirmCopy(action).success)
			setPendingAction(null)
			queryClient.invalidateQueries({ queryKey: ['seller-orders'] })
			queryClient.invalidateQueries({
				queryKey: ['seller-order', action.orderId],
			})
			queryClient.invalidateQueries({ queryKey: ['seller-unread'] })
		},
	})

	const orders = data?.orders ?? []
	const total = data?.total ?? 0
	const totalPages = data?.totalPages ?? 1
	const currentPage = data?.page ?? page
	const confirm = pendingAction ? confirmCopy(pendingAction) : null
	const isEmptyStore =
		total === 0 &&
		statusFilter === 'all' &&
		!searchFromUrl &&
		dateFilter === 'all' &&
		!isLoading

	const rangeStart = total === 0 ? 0 : (currentPage - 1) * perPage + 1
	const rangeEnd = Math.min(currentPage * perPage, total)
	const pageList = buildPageList(currentPage, totalPages)
	const showPager = total > 0
	const isPageFetching = isFetching && !isLoading

	function goToPage(nextPage: number) {
		if (nextPage < 1 || nextPage > totalPages) return
		replaceParams({
			page: nextPage <= 1 ? null : String(nextPage),
			perPage:
				perPage === DEFAULT_PER_PAGE ? null : String(perPage),
		})
	}

	if (isLoading && !data) return <OrdersTableSkeleton />

	if (isError && !data) {
		return (
			<div className='flex w-full min-w-0 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center'>
				<h2 className='font-heading text-lg font-bold tracking-tight'>
					Não foi possível carregar os pedidos
				</h2>
				<p className='mt-1.5 max-w-md text-sm text-muted-foreground'>
					Verifique a ligação e tente outra vez.
				</p>
				<Button
					className='mt-6 rounded-full'
					variant='outline'
					onClick={() => refetch()}
				>
					Tentar novamente
				</Button>
			</div>
		)
	}

	return (
		<div className='w-full min-w-0 space-y-6 pb-10'>
			<p className='max-w-3xl text-sm leading-relaxed text-muted-foreground'>
				Acompanhe e actualize os pedidos da sua loja.
			</p>

			{isEmptyStore ? (
				<div className='flex w-full flex-col items-center rounded-xl border border-border bg-card px-6 py-16 text-center sm:py-20'>
					<div className='flex size-14 items-center justify-center rounded-xl bg-muted'>
						<ShoppingBag className='size-7 text-muted-foreground' />
					</div>
					<h2 className='mt-5 font-heading text-2xl font-bold tracking-tight'>
						Nenhum pedido ainda
					</h2>
					<p className='mt-2 max-w-md text-sm leading-relaxed text-muted-foreground'>
						Quando um cliente comprar na sua loja, o pedido aparece
						aqui para confirmar o envio e a entrega.
					</p>
					<Button
						variant='outline'
						className='mt-6 rounded-full'
						render={<Link href='/dashboard/seller/produtos' />}
					>
						Ver produtos
					</Button>
				</div>
			) : (
				<>
					<div className='flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
						<div className='relative min-w-0 flex-1 sm:max-w-md'>
							<Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								placeholder='Nº do pedido ou nome do cliente…'
								aria-label='Pesquisar pedidos'
								className='h-10 rounded-full border-border bg-background pr-10 pl-9'
							/>
							{searchInput ? (
								<span className='absolute top-1/2 right-1.5 -translate-y-1/2'>
									<IconTooltipButton
										label='Limpar pesquisa'
										className='size-8 text-muted-foreground'
										onClick={() => setSearchInput('')}
									>
										<X className='size-4' />
									</IconTooltipButton>
								</span>
							) : null}
						</div>
						<div className='flex flex-wrap gap-2'>
							<Select
								value={statusFilter}
								onValueChange={(v) => {
									if (!v) return
									replaceParams(
										{ status: v },
										{ resetPage: true }
									)
								}}
							>
								<SelectTrigger className='h-10 w-full rounded-full sm:w-40'>
									<SelectValue placeholder='Estado' />
								</SelectTrigger>
								<SelectContent>
									{STATUS_OPTIONS.map((o) => (
										<SelectItem
											key={o.value}
											value={o.value}
										>
											{o.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								value={dateFilter}
								onValueChange={(v) => {
									if (!v) return
									replaceParams(
										{ date: v },
										{ resetPage: true }
									)
								}}
							>
								<SelectTrigger className='h-10 w-full rounded-full sm:w-44'>
									<SelectValue placeholder='Período' />
								</SelectTrigger>
								<SelectContent>
									{DATE_OPTIONS.map((o) => (
										<SelectItem
											key={o.value}
											value={o.value}
										>
											{o.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								value={String(perPage)}
								onValueChange={(v) => {
									if (!v) return
									replaceParams(
										{
											perPage:
												v === String(DEFAULT_PER_PAGE)
													? null
													: v,
										},
										{ resetPage: true }
									)
								}}
							>
								<SelectTrigger
									className='h-10 w-full rounded-full sm:w-36'
									aria-label='Itens por página'
								>
									<SelectValue placeholder='Por página' />
								</SelectTrigger>
								<SelectContent>
									{PER_PAGE_OPTIONS.map((n) => (
										<SelectItem key={n} value={String(n)}>
											{n} / página
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<p className='text-sm text-muted-foreground' aria-live='polite'>
						{total === 0
							? 'Nenhum pedido encontrado'
							: `Mostrando ${rangeStart}–${rangeEnd} de ${total} ${total === 1 ? 'pedido' : 'pedidos'}`}
					</p>

					{orders.length === 0 ? (
						<div className='rounded-xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center'>
							<p className='text-sm text-muted-foreground'>
								Nenhum pedido corresponde aos filtros actuais.
							</p>
							<Button
								variant='ghost'
								size='sm'
								className='mt-3 rounded-full'
								onClick={() => {
									setSearchInput('')
									replaceParams(
										{
											q: null,
											status: null,
											date: null,
											page: null,
										},
										{ resetPage: true }
									)
								}}
							>
								Limpar filtros
							</Button>
						</div>
					) : (
						<>
							<div className='relative'>
								{isPageFetching ? (
									<div
										className='absolute inset-0 z-10 rounded-xl bg-background/50 transition-opacity duration-200'
										aria-hidden
									/>
								) : null}

								<ul className='flex w-full flex-col gap-2 md:hidden'>
									{orders.map((order) => (
										<li key={order.id}>
											<button
												type='button'
												onClick={() =>
													setSelectedId(order.id)
												}
												className={cn(
													'flex w-full min-w-0 flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3.5 text-left',
													'transition-colors duration-200 hover:bg-muted/40',
													'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
												)}
											>
												<div className='flex items-start justify-between gap-3'>
													<div className='min-w-0'>
														<p className='font-heading text-sm font-semibold tracking-tight'>
															#{order.shortId}
														</p>
														<p className='truncate text-sm font-medium'>
															{order.customerName}
														</p>
													</div>
													<OrderStatusBadge
														status={order.status}
														label={
															order.statusLabel
														}
													/>
												</div>
												<p className='truncate text-sm text-muted-foreground'>
													{order.itemsSummary}
												</p>
												<div className='flex items-center justify-between gap-2'>
													<span className='text-xs text-muted-foreground'>
														{formatOrderDate(
															order.date
														)}
													</span>
													<span className='text-sm font-semibold tabular-nums'>
														{formatPrice(
															order.total,
															order.currency
														)}
													</span>
												</div>
												<ReviewBadge
													state={order.reviewState}
												/>
											</button>
										</li>
									))}
								</ul>

								<div className='hidden w-full overflow-hidden rounded-xl border border-border md:block'>
									<Table>
										<TableHeader>
											<TableRow className='bg-muted/40 hover:bg-muted/40'>
												<TableHead className='px-4'>
													Pedido
												</TableHead>
												<TableHead>Cliente</TableHead>
												<TableHead className='hidden lg:table-cell'>
													Itens
												</TableHead>
												<TableHead>Total</TableHead>
												<TableHead className='hidden xl:table-cell'>
													Data
												</TableHead>
												<TableHead>Estado</TableHead>
												<TableHead className='px-4 text-right'>
													Acções
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{orders.map((order) => (
												<TableRow
													key={order.id}
													className='cursor-pointer transition-colors duration-200'
													onClick={() =>
														setSelectedId(order.id)
													}
												>
													<TableCell className='px-4'>
														<span className='font-heading font-semibold tracking-tight'>
															#{order.shortId}
														</span>
													</TableCell>
													<TableCell className='max-w-48'>
														<p className='truncate font-medium'>
															{order.customerName}
														</p>
														{order.customerEmail ? (
															<p className='truncate text-xs text-muted-foreground'>
																{
																	order.customerEmail
																}
															</p>
														) : null}
													</TableCell>
													<TableCell className='hidden max-w-56 truncate text-muted-foreground lg:table-cell'>
														{order.itemsSummary}
													</TableCell>
													<TableCell className='font-semibold tabular-nums'>
														{formatPrice(
															order.total,
															order.currency
														)}
													</TableCell>
													<TableCell className='hidden text-muted-foreground xl:table-cell'>
														{formatOrderDate(
															order.date
														)}
													</TableCell>
													<TableCell>
														<div className='flex flex-col items-start gap-1'>
															<OrderStatusBadge
																status={
																	order.status
																}
																label={
																	order.statusLabel
																}
															/>
															<ReviewBadge
																state={
																	order.reviewState
																}
															/>
														</div>
													</TableCell>
													<TableCell
														className='px-4 text-right'
														onClick={(e) =>
															e.stopPropagation()
														}
													>
														<div className='inline-flex items-center justify-end gap-0.5'>
															{order.allowedActions
																.markCompleted ? (
																<IconTooltipButton
																	label='Marcar como entregue'
																	onClick={() =>
																		setPendingAction(
																			{
																				orderId:
																					order.id,
																				shortId:
																					order.shortId,
																				nextStatus:
																					'COMPLETED',
																			}
																		)
																	}
																>
																	<CheckCircle2 className='size-4' />
																</IconTooltipButton>
															) : null}
															<OrderActionsMenu
																order={order}
																onAction={
																	setPendingAction
																}
																onOpen={() =>
																	setSelectedId(
																		order.id
																	)
																}
															/>
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>

							{showPager ? (
								<div className='flex w-full flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between'>
									<p className='text-sm tabular-nums text-muted-foreground min-w-40' aria-live='polite'>
										Página {currentPage} de {totalPages}
									</p>

									{/* Mobile: primeira / anterior / seguinte / última */}
									<div className='flex items-center justify-center gap-1.5 md:hidden'>
										<Button
											variant='outline'
											size='icon'
											className='rounded-full'
											disabled={currentPage <= 1}
											aria-label='Primeira página'
											onClick={() => goToPage(1)}
										>
											<ChevronsLeft className='size-4' />
										</Button>
										<Button
											variant='outline'
											size='icon'
											className='rounded-full'
											disabled={currentPage <= 1}
											aria-label='Página anterior'
											onClick={() =>
												goToPage(currentPage - 1)
											}
										>
											<ChevronLeft className='size-4' />
										</Button>
										<Button
											variant='outline'
											size='icon'
											className='rounded-full'
											disabled={
												currentPage >= totalPages
											}
											aria-label='Página seguinte'
											onClick={() =>
												goToPage(currentPage + 1)
											}
										>
											<ChevronRight className='size-4' />
										</Button>
										<Button
											variant='outline'
											size='icon'
											className='rounded-full'
											disabled={
												currentPage >= totalPages
											}
											aria-label='Última página'
											onClick={() =>
												goToPage(totalPages)
											}
										>
											<ChevronsRight className='size-4' />
										</Button>
									</div>

									{/* Desktop: primeira + anterior + números + seguinte + última */}
									<Pagination className='hidden justify-end md:flex'>
										<PaginationContent>
											<PaginationItem>
												<Button
													variant='ghost'
													size='icon'
													className='rounded-full'
													disabled={currentPage <= 1}
													aria-label='Ir para a primeira página'
													onClick={() => goToPage(1)}
												>
													<ChevronsLeft className='size-4' />
												</Button>
											</PaginationItem>
											<PaginationItem>
												<Button
													variant='ghost'
													size='default'
													className='gap-1 rounded-full pl-2'
													disabled={currentPage <= 1}
													aria-label='Ir para página anterior'
													onClick={() =>
														goToPage(
															currentPage - 1
														)
													}
												>
													<ChevronLeft className='size-4' />
													<span>Anterior</span>
												</Button>
											</PaginationItem>
											{pageList.map((item, idx) =>
												item === 'ellipsis' ? (
													<PaginationItem
														key={`e-${idx}`}
													>
														<PaginationEllipsis />
													</PaginationItem>
												) : (
													<PaginationItem key={item}>
														<Button
															variant={
																item ===
																currentPage
																	? 'outline'
																	: 'ghost'
															}
															size='icon'
															className='rounded-full'
															aria-label={`Ir para página ${item}`}
															aria-current={
																item ===
																currentPage
																	? 'page'
																	: undefined
															}
															onClick={() =>
																goToPage(item)
															}
														>
															{item}
														</Button>
													</PaginationItem>
												)
											)}
											<PaginationItem>
												<Button
													variant='ghost'
													size='default'
													className='gap-1 rounded-full pr-2'
													disabled={
														currentPage >=
														totalPages
													}
													aria-label='Ir para página seguinte'
													onClick={() =>
														goToPage(
															currentPage + 1
														)
													}
												>
													<span>Próxima</span>
													<ChevronRight className='size-4' />
												</Button>
											</PaginationItem>
											<PaginationItem>
												<Button
													variant='ghost'
													size='icon'
													className='rounded-full'
													disabled={
														currentPage >=
														totalPages
													}
													aria-label='Ir para a última página'
													onClick={() =>
														goToPage(totalPages)
													}
												>
													<ChevronsRight className='size-4' />
												</Button>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</div>
							) : null}
						</>
					)}
				</>
			)}

			<Sheet
				open={Boolean(selectedId)}
				onOpenChange={(open) => {
					if (!open) setSelectedId(null)
				}}
			>
				<SheetContent
					side='right'
					className='flex w-full flex-col gap-0 p-0 sm:max-w-md'
				>
					{selectedId ? (
						<SellerOrderDetailSheetContent
							orderId={selectedId}
							onAction={setPendingAction}
						/>
					) : null}
				</SheetContent>
			</Sheet>

			<AlertDialog
				open={Boolean(pendingAction)}
				onOpenChange={(open) => {
					if (!open && !statusMutation.isPending) {
						setPendingAction(null)
					}
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{confirm?.title}</AlertDialogTitle>
						<AlertDialogDescription>
							{confirm?.description}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							disabled={statusMutation.isPending}
							className='rounded-full'
						>
							Voltar
						</AlertDialogCancel>
						<AlertDialogAction
							variant={
								confirm?.destructive
									? 'destructive'
									: 'default'
							}
							className='rounded-full'
							disabled={statusMutation.isPending}
							onClick={(e) => {
								e.preventDefault()
								if (pendingAction) {
									statusMutation.mutate(pendingAction)
								}
							}}
						>
							{statusMutation.isPending ? (
								<>
									<Loader2 className='size-4 animate-spin' />
									A actualizar…
								</>
							) : (
								confirm?.confirmLabel
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
