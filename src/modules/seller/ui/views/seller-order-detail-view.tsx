'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	ArrowLeft,
	CheckCircle2,
	Loader2,
	PackageSearch,
	Truck,
	XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import type { OrderStatus } from '@/lib/orders/status-transitions'
import { cn } from '@/lib/utils'
import { useSellerAccess } from '@/modules/seller/hooks/use-seller-access'
import { formatPrice } from '@/utils/format-price'
import { IconTooltipButton } from '../components/icon-tooltip-button'
import { useSetSellerPageMeta } from '../layouts/seller-page-meta'

interface SellerOrderDetailViewProps {
	id: string
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
	reviewState: 'none' | 'awaiting' | 'done'
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

type PendingStatus = Extract<OrderStatus, 'SHIPPING' | 'COMPLETED' | 'CANCELLED'>

function formatDateTime(iso: string) {
	return new Date(iso).toLocaleString('pt-PT', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

function confirmCopy(shortId: string, next: PendingStatus) {
	if (next === 'COMPLETED') {
		return {
			title: `Confirmar que o pedido #${shortId} foi entregue?`,
			description:
				'Esta acção não pode ser anulada. O cliente poderá avaliar a loja e os produtos.',
			confirmLabel: 'Marcar como entregue',
			success: 'Pedido marcado como entregue. O cliente foi notificado.',
		}
	}
	if (next === 'SHIPPING') {
		return {
			title: `Marcar pedido #${shortId} como em envio?`,
			description:
				'O cliente será notificado de que o pedido está a caminho.',
			confirmLabel: 'Confirmar envio',
			success: 'Pedido em envio. O cliente foi notificado.',
		}
	}
	return {
		title: `Cancelar pedido #${shortId}?`,
		description:
			'O cliente será notificado. Pedidos cancelados não podem ser reactivados.',
		confirmLabel: 'Cancelar pedido',
		success: 'Pedido cancelado. O cliente foi notificado.',
	}
}

export const SellerOrderDetailView = ({ id }: SellerOrderDetailViewProps) => {
	useSetSellerPageMeta({
		title: 'Detalhe do pedido',
		crumbs: ['Dashboard', 'Pedidos', `#${id.slice(0, 8)}`],
	})

	const queryClient = useQueryClient()
	const [pending, setPending] = useState<PendingStatus | null>(null)
	const { can } = useSellerAccess()
	const canUpdateOrder = can('order.update')

	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ['seller-order', id],
		queryFn: async () => {
			const res = await fetch(`/api/seller/orders/${id}`)
			if (res.status === 404) return null
			if (!res.ok) {
				const json = await res.json().catch(() => ({}))
				throw new Error(json.error ?? 'Falha ao carregar')
			}
			const json = await res.json()
			return json.order as OrderDetail
		},
	})

	const mutation = useMutation({
		mutationFn: async (nextStatus: PendingStatus) => {
			const res = await fetch(`/api/seller/orders/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: nextStatus }),
			})
			const json = await res.json()
			if (!res.ok) throw new Error(json.error ?? 'Falha ao actualizar')
			return { nextStatus, order: json.order as OrderDetail }
		},
		onSuccess: ({ nextStatus }) => {
			toast.success(confirmCopy(id.slice(0, 8), nextStatus).success)
			setPending(null)
			queryClient.invalidateQueries({ queryKey: ['seller-order', id] })
			queryClient.invalidateQueries({ queryKey: ['seller-orders'] })
		},
		onError: (error: Error, nextStatus) => {
			toast.error(error.message, {
				action: {
					label: 'Tentar novamente',
					onClick: () => mutation.mutate(nextStatus),
				},
			})
		},
	})

	if (isLoading) {
		return (
			<div className='w-full min-w-0 space-y-4'>
				<div className='h-8 w-48 animate-pulse rounded-lg bg-muted' />
				<div className='h-40 animate-pulse rounded-xl bg-muted' />
				<div className='h-56 animate-pulse rounded-xl bg-muted' />
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex w-full min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center'>
				<p className='font-heading text-lg font-bold'>
					Não foi possível carregar o pedido
				</p>
				<Button
					variant='outline'
					className='rounded-full'
					onClick={() => refetch()}
				>
					Tentar novamente
				</Button>
			</div>
		)
	}

	if (!data) {
		return (
			<div className='flex w-full min-h-[50vh] flex-col items-center justify-center gap-4 px-4'>
				<div className='flex size-14 items-center justify-center rounded-xl bg-muted'>
					<PackageSearch className='size-7 text-muted-foreground' />
				</div>
				<div className='text-center'>
					<p className='font-heading text-lg font-bold'>
						Pedido não encontrado
					</p>
					<p className='mt-1 text-sm text-muted-foreground'>
						Este pedido não existe nesta loja ou foi removido.
					</p>
				</div>
				<Button
					variant='outline'
					className='rounded-full'
					render={<Link href='/dashboard/seller/pedidos' />}
				>
					<ArrowLeft className='size-4' />
					Voltar aos pedidos
				</Button>
			</div>
		)
	}

	const shortId = data.id.slice(0, 8)
	const confirm = pending ? confirmCopy(shortId, pending) : null

	return (
		<div className='w-full min-w-0 space-y-6 pb-10'>
			<div className='flex flex-wrap items-center gap-3'>
				<IconTooltipButton
					label='Voltar aos pedidos'
					href='/dashboard/seller/pedidos'
				>
					<ArrowLeft className='size-4' />
				</IconTooltipButton>
				<div className='min-w-0 flex-1'>
					<p className='text-sm text-muted-foreground'>
						Pedido #{shortId}
					</p>
					<h1 className='font-heading text-xl font-bold tracking-tight'>
						Detalhe do pedido
					</h1>
				</div>
				<OrderStatusBadge
					status={data.status}
					label={data.statusLabel}
				/>
			</div>

			{data.reviewState === 'awaiting' ? (
				<p className='rounded-xl border border-border bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200'>
					Aguardando avaliação do cliente.
				</p>
			) : null}

			<section className='rounded-xl border border-border bg-card p-5'>
				<p className='text-xs font-medium text-muted-foreground'>
					Cliente
				</p>
				<p className='mt-1 font-heading font-semibold'>
					{data.buyer.name}
				</p>
				{data.buyer.email ? (
					<p className='text-sm text-muted-foreground'>
						{data.buyer.email}
					</p>
				) : null}
				{data.buyer.phone ? (
					<p className='text-sm text-muted-foreground'>
						{data.buyer.phone}
					</p>
				) : null}
			</section>

			<section className='rounded-xl border border-border bg-card p-5'>
				<p className='mb-3 text-xs font-medium text-muted-foreground'>
					Itens
				</p>
				<ul className='divide-y divide-border'>
					{data.items.map((item) => (
						<li
							key={item.id}
							className='flex justify-between gap-3 py-2.5 text-sm first:pt-0 last:pb-0'
						>
							<div className='min-w-0'>
								<p className='font-medium'>{item.productName}</p>
								<p className='text-xs text-muted-foreground'>
									Qtd. {item.quantity}
								</p>
							</div>
							<p className='font-medium tabular-nums'>
								{formatPrice(
									item.unitPrice * item.quantity,
									item.currency
								)}
							</p>
						</li>
					))}
				</ul>
				<div className='mt-4 flex justify-between border-t border-border pt-3 text-sm'>
					<span className='text-muted-foreground'>Total</span>
					<span className='font-heading text-base font-bold tabular-nums'>
						{formatPrice(data.total, data.currency)}
					</span>
				</div>
			</section>

			<section className='rounded-xl border border-border bg-card p-5'>
				<p className='mb-4 text-xs font-medium text-muted-foreground'>
					Histórico
				</p>
				<ol className='relative space-y-4 border-l border-border pl-4'>
					{data.timeline.map((step, index) => (
						<li key={`${step.status}-${index}`}>
							<span
								className={cn(
									'absolute -left-1.5 mt-1.5 size-3 rounded-full border-2 border-background',
									step.status === 'COMPLETED' &&
										'bg-emerald-500',
									step.status === 'SHIPPING' && 'bg-sky-500',
									step.status === 'PENDING' && 'bg-amber-400',
									step.status === 'CONTACTED' &&
										'bg-amber-500',
									step.status === 'CANCELLED' &&
										'bg-muted-foreground'
								)}
							/>
							<p className='text-sm font-medium'>{step.label}</p>
							<p className='text-xs text-muted-foreground'>
								{formatDateTime(step.at)}
							</p>
							{step.note ? (
								<p className='mt-0.5 text-xs text-muted-foreground'>
									{step.note}
								</p>
							) : null}
						</li>
					))}
				</ol>
			</section>

			{canUpdateOrder &&
				(data.status === 'PENDING' ||
					data.status === 'CONTACTED' ||
					data.status === 'SHIPPING') && (
				<section className='flex flex-wrap gap-2'>
					{data.status === 'SHIPPING' ? (
						<Button
							className='rounded-full transition-all duration-200'
							aria-label={`Marcar pedido ${shortId} como entregue`}
							onClick={() => setPending('COMPLETED')}
						>
							<CheckCircle2 className='size-4' />
							Marcar como entregue
						</Button>
					) : null}
					{data.status === 'PENDING' ||
					data.status === 'CONTACTED' ? (
						<Button
							className='rounded-full transition-all duration-200'
							aria-label={`Marcar pedido ${shortId} como em envio`}
							onClick={() => setPending('SHIPPING')}
						>
							<Truck className='size-4' />
							Marcar como em envio
						</Button>
					) : null}
					<Button
						variant='destructive'
						className='rounded-full transition-all duration-200'
						aria-label={`Cancelar pedido ${shortId}`}
						onClick={() => setPending('CANCELLED')}
					>
						<XCircle className='size-4' />
						Cancelar pedido
					</Button>
				</section>
			)}

			<AlertDialog
				open={Boolean(pending)}
				onOpenChange={(open) => {
					if (!open && !mutation.isPending) setPending(null)
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
							disabled={mutation.isPending}
							className='rounded-full'
						>
							Voltar
						</AlertDialogCancel>
						<AlertDialogAction
							variant={
								pending === 'CANCELLED'
									? 'destructive'
									: 'default'
							}
							className='rounded-full'
							disabled={mutation.isPending}
							onClick={(e) => {
								e.preventDefault()
								if (pending) mutation.mutate(pending)
							}}
						>
							{mutation.isPending ? (
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
