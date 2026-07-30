'use client'

/**
 * Order detail Sheet — matches product preview shell: sticky header,
 * scroll body, sticky footer actions. Operate grammar only.
 */

import { useQuery } from '@tanstack/react-query'
import {
	CheckCircle2,
	Mail,
	Package,
	Phone,
	Truck,
	User,
	XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import type { OrderStatus } from '@/lib/orders/status-transitions'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'
import { ReviewBadge } from './orders/review-badge'
import type { ReviewState } from './orders/types'

export type OrderSheetPendingAction = {
	orderId: string
	shortId: string
	nextStatus: Extract<OrderStatus, 'SHIPPING' | 'COMPLETED' | 'CANCELLED'>
}

type OrderDetail = {
	id: string
	status: OrderStatus
	statusLabel: string
	total: number
	currency: string
	itemCount: number
	createdAt: string
	completedAt: string | null
	reviewEligible: boolean
	reviewState: ReviewState
	notes: string | null
	buyer: {
		id: string | null
		name: string
		email: string | null
		phone: string | null
	}
	items: Array<{
		id: string
		quantity: number
		unitPrice: number
		currency: string
		productName: string
	}>
	timeline: Array<{
		status: OrderStatus
		label: string
		at: string
		note?: string
	}>
}

function formatDateTime(iso: string) {
	return new Date(iso).toLocaleString('pt-PT', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

function formatOrderDate(iso: string) {
	return new Date(iso).toLocaleDateString('pt-PT', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
}

function timelineDotClass(status: OrderStatus) {
	switch (status) {
		case 'COMPLETED':
			return 'bg-emerald-500'
		case 'SHIPPING':
			return 'bg-sky-500'
		case 'CANCELLED':
			return 'bg-muted-foreground'
		default:
			return 'bg-amber-500'
	}
}

function SheetSkeleton() {
	return (
		<>
			<SheetHeader className='shrink-0 border-b border-border px-6 py-4'>
				<Skeleton className='h-6 w-36' />
				<Skeleton className='mt-1 h-4 w-48' />
			</SheetHeader>
			<div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
				<div className='flex gap-2'>
					<Skeleton className='h-5 w-24 rounded-full' />
					<Skeleton className='h-5 w-32 rounded-full' />
				</div>
				<Skeleton className='h-24 w-full rounded-xl' />
				<Skeleton className='h-40 w-full rounded-xl' />
				<Skeleton className='h-36 w-full rounded-xl' />
			</div>
			<SheetFooter className='shrink-0 border-t border-border px-6 py-4'>
				<Skeleton className='h-10 w-full rounded-full' />
			</SheetFooter>
		</>
	)
}

export function SellerOrderDetailSheetContent({
	orderId,
	onAction,
}: {
	orderId: string
	onAction: (action: OrderSheetPendingAction) => void
}) {
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ['seller-order', orderId],
		queryFn: async () => {
			const res = await fetch(`/api/seller/orders/${orderId}`)
			if (!res.ok) {
				const json = await res.json().catch(() => ({}))
				throw new Error(json.error ?? 'Falha ao carregar pedido')
			}
			const json = await res.json()
			return json.order as OrderDetail
		},
	})

	if (isLoading) return <SheetSkeleton />

	if (isError || !data) {
		return (
			<>
				<SheetHeader className='shrink-0 border-b border-border px-6 py-4'>
					<SheetTitle className='font-heading pr-8 text-left'>
						Pedido
					</SheetTitle>
					<SheetDescription className='text-left'>
						Não foi possível carregar os detalhes.
					</SheetDescription>
				</SheetHeader>
				<div className='flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center'>
					<div className='flex size-12 items-center justify-center rounded-xl bg-muted'>
						<Package className='size-6 text-muted-foreground' />
					</div>
					<p className='text-sm text-muted-foreground'>
						Verifique a ligação e tente outra vez.
					</p>
					<Button
						variant='outline'
						size='sm'
						className='rounded-full'
						onClick={() => refetch()}
					>
						Tentar novamente
					</Button>
				</div>
			</>
		)
	}

	const shortId = data.id.slice(0, 8)
	const canShip = data.status === 'PENDING' || data.status === 'CONTACTED'
	const canComplete = data.status === 'SHIPPING'
	const canCancel =
		data.status === 'PENDING' ||
		data.status === 'CONTACTED' ||
		data.status === 'SHIPPING'
	const hasActions = canShip || canComplete || canCancel

	return (
		<>
			<SheetHeader className='shrink-0 border-b border-border px-6 py-4'>
				<div className='flex flex-wrap items-start justify-between gap-2 pr-8'>
					<div className='min-w-0'>
						<SheetTitle className='font-heading text-left tracking-tight'>
							Pedido #{shortId}
						</SheetTitle>
						<SheetDescription className='mt-1 text-left'>
							{formatOrderDate(data.createdAt)} · {data.itemCount}{' '}
							{data.itemCount === 1 ? 'item' : 'itens'}
						</SheetDescription>
					</div>
				</div>
				<div className='mt-3 flex flex-wrap items-center gap-2'>
					<OrderStatusBadge
						status={data.status}
						label={data.statusLabel}
					/>
					<ReviewBadge state={data.reviewState} />
				</div>
			</SheetHeader>

			<div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
				<section className='space-y-3'>
					<div className='flex items-center gap-2'>
						<span className='flex size-8 items-center justify-center rounded-lg bg-muted'>
							<User className='size-4 text-muted-foreground' />
						</span>
						<div className='min-w-0'>
							<p className='text-xs font-medium text-muted-foreground'>
								Cliente
							</p>
							<p className='truncate font-heading text-sm font-semibold tracking-tight'>
								{data.buyer.name}
							</p>
						</div>
					</div>
					{(data.buyer.email || data.buyer.phone) && (
						<div className='space-y-1.5 rounded-xl border border-border bg-muted/30 px-3.5 py-3'>
							{data.buyer.email ? (
								<p className='flex items-center gap-2 text-sm text-muted-foreground'>
									<Mail className='size-3.5 shrink-0' />
									<span className='min-w-0 truncate'>
										{data.buyer.email}
									</span>
								</p>
							) : null}
							{data.buyer.phone ? (
								<p className='flex items-center gap-2 text-sm text-muted-foreground'>
									<Phone className='size-3.5 shrink-0' />
									<span>{data.buyer.phone}</span>
								</p>
							) : null}
						</div>
					)}
				</section>

				<Separator />

				<section className='space-y-3'>
					<p className='text-xs font-medium text-muted-foreground'>
						Itens
					</p>
					<ul className='overflow-hidden rounded-xl border border-border'>
						{data.items.map((item, index) => (
							<li
								key={item.id}
								className={cn(
									'flex items-start justify-between gap-3 px-3.5 py-3 text-sm',
									index > 0 && 'border-t border-border'
								)}
							>
								<div className='min-w-0'>
									<p className='truncate font-medium'>
										{item.productName}
									</p>
									<p className='mt-0.5 text-xs text-muted-foreground'>
										{formatPrice(
											item.unitPrice,
											item.currency
										)}{' '}
										· Qtd. {item.quantity}
									</p>
								</div>
								<p className='shrink-0 font-semibold tabular-nums'>
									{formatPrice(
										item.unitPrice * item.quantity,
										item.currency
									)}
								</p>
							</li>
						))}
					</ul>
					<div className='flex items-baseline justify-between gap-3 px-0.5'>
						<span className='text-sm text-muted-foreground'>
							Total
						</span>
						<span className='font-heading text-xl font-bold tracking-tight tabular-nums'>
							{formatPrice(data.total, data.currency)}
						</span>
					</div>
				</section>

				<Separator />

				<section className='space-y-3'>
					<p className='text-xs font-medium text-muted-foreground'>
						Histórico
					</p>
					<ol className='relative space-y-4 border-l border-border pl-4'>
						{data.timeline.map((step, index) => (
							<li
								key={`${step.status}-${step.at}-${index}`}
								className='relative'
							>
								<span
									className={cn(
										'absolute -left-[21px] mt-1.5 size-2.5 rounded-full border-2 border-background ring-1 ring-border',
										timelineDotClass(step.status)
									)}
								/>
								<p className='text-sm font-medium leading-snug'>
									{step.label}
								</p>
								<p className='mt-0.5 text-xs text-muted-foreground'>
									{formatDateTime(step.at)}
								</p>
								{step.note ? (
									<p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
										{step.note}
									</p>
								) : null}
							</li>
						))}
					</ol>
					{data.notes && data.status === 'CANCELLED' ? (
						<p className='rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground'>
							{data.notes}
						</p>
					) : null}
				</section>
			</div>

			<SheetFooter className='shrink-0 gap-2 border-t border-border px-6 py-4 sm:flex-col'>
				{canComplete ? (
					<Button
						className='w-full rounded-full transition-all duration-200'
						aria-label={`Marcar pedido ${shortId} como entregue`}
						onClick={() =>
							onAction({
								orderId: data.id,
								shortId,
								nextStatus: 'COMPLETED',
							})
						}
					>
						<CheckCircle2 className='size-4' />
						Marcar como entregue
					</Button>
				) : null}
				{canShip ? (
					<Button
						className='w-full rounded-full transition-all duration-200'
						aria-label={`Marcar pedido ${shortId} como em envio`}
						onClick={() =>
							onAction({
								orderId: data.id,
								shortId,
								nextStatus: 'SHIPPING',
							})
						}
					>
						<Truck className='size-4' />
						Marcar como em envio
					</Button>
				) : null}
				{canCancel ? (
					<Button
						variant='destructive'
						className='w-full rounded-full transition-all duration-200'
						aria-label={`Cancelar pedido ${shortId}`}
						onClick={() =>
							onAction({
								orderId: data.id,
								shortId,
								nextStatus: 'CANCELLED',
							})
						}
					>
						<XCircle className='size-4' />
						Cancelar pedido
					</Button>
				) : null}
				{!hasActions ? (
					<p className='text-center text-xs text-muted-foreground'>
						{data.status === 'COMPLETED'
							? 'Pedido entregue'
							: 'Pedido cancelado'}
					</p>
				) : null}
				<Button
					variant='outline'
					className='w-full rounded-full'
					render={
						<Link href={`/dashboard/seller/pedidos/${data.id}`} />
					}
				>
					Ver pedido completo
				</Button>
			</SheetFooter>
		</>
	)
}
