'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
	ArrowLeft,
	MessageCircle,
	PackageSearch,
	RefreshCw,
	RotateCcw,
	Store,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
	fetchOrder,
	PRODUCT_PLACEHOLDER,
	STORE_PLACEHOLDER,
} from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { cn } from '@/lib/utils'
import type { BuyerOrder, BuyerOrderStatus } from '@/modules/orders/types'
import { formatPrice } from '@/utils/format-price'
import { OrderDetailSkeleton } from '../components/order-detail-skeleton'
import {
	OrderReviewForm,
	OrderReviewWaitingPanel,
} from '../components/order-review-form'
import { OrderReviewSummary } from '../components/order-review-summary'
import { OrderTimeline } from '../components/order-timeline'

interface OrderDetailViewProps {
	id: string
}

function statusTone(status: BuyerOrderStatus) {
	switch (status) {
		case 'shipping':
			return {
				panel: 'from-sky-500/[0.08] to-transparent',
				ring: 'ring-sky-500/15',
			}
		case 'completed':
			return {
				panel: 'from-emerald-500/[0.08] to-transparent',
				ring: 'ring-emerald-500/15',
			}
		case 'cancelled':
			return {
				panel: 'from-muted to-transparent',
				ring: 'ring-border/60',
			}
		default:
			return {
				panel: 'from-amber-500/[0.1] to-transparent',
				ring: 'ring-amber-500/15',
			}
	}
}

function statusGuidance(
	order: BuyerOrder,
	hasStoreReply: boolean
): { headline: string; detail: string } {
	switch (order.status) {
		case 'pending':
			return {
				headline: 'A loja está a tratar do teu pedido',
				detail:
					'Quando estiver pronto para envio, o estado actualiza-se aqui. Precisas de algo? Contacta a loja.',
			}
		case 'shipping':
			return {
				headline: 'O teu pedido está a caminho',
				detail:
					'Se tiveres dúvidas sobre prazo ou local de entrega, contacta a loja.',
			}
		case 'completed':
			if (order.reviewEligible) {
				return {
					headline: 'Pedido entregue',
					detail:
						'Avalia o atendimento da loja e os produtos nesta página.',
				}
			}
			if (hasStoreReply) {
				return {
					headline: 'Pedido entregue',
					detail:
						'A loja respondeu à tua avaliação. Vê a resposta ao lado (ou mais abaixo no telemóvel).',
				}
			}
			return {
				headline: 'Pedido entregue',
				detail:
					'A tua avaliação está nesta página. Se a loja responder, a mensagem aparece aqui.',
			}
		case 'cancelled':
			return {
				headline: 'Este pedido foi cancelado',
				detail:
					'Já não segue para entrega. Se tiveres dúvidas, contacta a loja.',
			}
	}
}

function itemCountLabel(count: number) {
	if (count <= 0) return null
	return count === 1 ? '1 item' : `${count} itens`
}

export const OrderDetailView = ({ id }: OrderDetailViewProps) => {
	const queryClient = useQueryClient()
	const { data, isLoading, isError, refetch, isFetching } = useQuery({
		queryKey: ['order', id],
		queryFn: () => fetchOrder(id),
	})

	if (isLoading) {
		return (
			<div aria-busy='true' aria-label='A carregar o pedido'>
				<OrderDetailSkeleton />
			</div>
		)
	}

	if (isError) {
		return (
			<div className='mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]'>
				<div className='flex size-14 items-center justify-center rounded-full bg-muted'>
					<RefreshCw className='size-7 text-muted-foreground' />
				</div>
				<div className='text-center'>
					<p className='font-heading text-lg font-semibold tracking-tight'>
						Não foi possível carregar o pedido
					</p>
					<p className='mt-1 text-sm text-muted-foreground'>
						Verifica a ligação e tenta outra vez.
					</p>
				</div>
				<div className='flex w-full max-w-xs flex-col gap-2 sm:flex-row sm:justify-center'>
					<Button
						variant='outline'
						className='min-h-11 rounded-full'
						disabled={isFetching}
						onClick={() => refetch()}
					>
						{isFetching ? 'A tentar…' : 'Tentar novamente'}
					</Button>
					<Button
						variant='ghost'
						className='min-h-11 rounded-full'
						render={<Link href='/feed/pedidos' />}
					>
						Voltar aos pedidos
					</Button>
				</div>
			</div>
		)
	}

	if (!data) {
		return (
			<div className='mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]'>
				<div className='flex size-14 items-center justify-center rounded-full bg-muted'>
					<PackageSearch className='size-7 text-muted-foreground' />
				</div>
				<div className='text-center'>
					<p className='font-heading text-lg font-semibold tracking-tight'>
						Pedido não encontrado
					</p>
					<p className='mt-1 text-sm text-muted-foreground'>
						Este pedido não existe ou já não está disponível.
					</p>
				</div>
				<Button
					render={<Link href='/feed/pedidos' />}
					variant='outline'
					className='min-h-11 rounded-full'
				>
					Voltar aos pedidos
				</Button>
			</div>
		)
	}

	const { order, items, timeline, notes, review } = data
	const firstProductId = items[0]?.productId
	const guidance = statusGuidance(order, Boolean(review?.storeReply))
	const tone = statusTone(order.status)
	const countLabel = itemCountLabel(order.itemCount || items.length)
	const canReview = order.status === 'completed' && order.reviewEligible
	const alreadyReviewed =
		order.status === 'completed' &&
		(!order.reviewEligible || Boolean(review))
	const showBuyAgain = order.status === 'completed' && Boolean(firstProductId)
	const hasMobileActions =
		Boolean(order.conversationId) ||
		Boolean(order.storeSlug) ||
		showBuyAgain

	return (
		<div
			className={cn(
				'mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8',
				hasMobileActions
					? 'pb-[max(6.5rem,env(safe-area-inset-bottom))] md:pb-10'
					: 'pb-[max(1.5rem,env(safe-area-inset-bottom))]'
			)}
		>
			<header className='mb-6 space-y-3'>
				<Button
					variant='ghost'
					size='sm'
					className='-ml-2 min-h-10 gap-1.5 text-muted-foreground hover:text-foreground'
					render={<Link href='/feed/pedidos' />}
				>
					<ArrowLeft className='size-4' aria-hidden />
					Voltar aos pedidos
				</Button>

				<div
					className={cn(
						'relative overflow-hidden rounded-2xl bg-linear-to-br ring-1',
						tone.panel,
						tone.ring
					)}
				>
					<div className='relative space-y-4 p-5 sm:p-6'>
						<div className='flex items-start justify-between gap-3'>
							<div className='min-w-0'>
								<p className='text-xs text-muted-foreground'>
									Pedido #{order.shortId}
								</p>
								<h1 className='mt-1 font-heading text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl'>
									{guidance.headline}
								</h1>
							</div>
							<OrderStatusBadge
								status={order.status}
								label={order.statusLabel}
								className='shrink-0'
							/>
						</div>

						<p className='max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-[15px]'>
							{guidance.detail}
						</p>

						<p className='text-xs text-muted-foreground'>
							{[order.date, countLabel].filter(Boolean).join(', ')}
						</p>
					</div>
				</div>
			</header>

			<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
				<div className='order-2 min-w-0 flex-1 space-y-6 lg:order-1'>
					<section
						className='space-y-3'
						aria-labelledby='order-progress'
					>
						<h2
							id='order-progress'
							className='font-heading text-sm font-semibold tracking-tight'
						>
							Estado do pedido
						</h2>
						<div className='rounded-2xl border border-border/70 bg-card p-4 sm:p-5'>
							<OrderTimeline steps={timeline} />
							{notes ? (
								<>
									<Separator className='my-4' />
									<div>
										<p className='text-xs font-medium text-muted-foreground'>
											Nota da loja
										</p>
										<p className='mt-1 text-sm leading-relaxed text-foreground'>
											{notes}
										</p>
									</div>
								</>
							) : null}
						</div>
					</section>

					<section
						className='space-y-3'
						aria-labelledby='order-items'
					>
						<div className='flex items-end justify-between gap-3'>
							<h2
								id='order-items'
								className='font-heading text-sm font-semibold tracking-tight'
							>
								O que pediste
							</h2>
							<p className='text-sm font-bold tabular-nums text-foreground'>
								{formatPrice(order.total, order.currency)}
							</p>
						</div>

						<ul className='overflow-hidden rounded-2xl border border-border/70 bg-card'>
							{items.map((item, index) => (
								<li key={item.id}>
									{index > 0 ? (
										<Separator className='opacity-60' />
									) : null}
									<div className='flex gap-3 p-4 sm:gap-4'>
										<div className='relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-18'>
											<Image
												src={
													item.imageUrl ??
													PRODUCT_PLACEHOLDER
												}
												alt={item.productName}
												fill
												placeholder='blur'
												blurDataURL={BLUR_PLACEHOLDER}
												sizes='72px'
												className='object-cover'
											/>
										</div>
										<div className='min-w-0 flex-1 space-y-1'>
											{item.productId ? (
												<Link
													href={`/product/${item.productId}`}
													className='line-clamp-2 font-medium text-foreground underline-offset-2 hover:underline'
												>
													{item.productName}
												</Link>
											) : (
												<p className='line-clamp-2 font-medium'>
													{item.productName}
												</p>
											)}
											<p className='text-xs text-muted-foreground'>
												{item.quantity === 1
													? '1 unidade'
													: `${item.quantity} unidades`}
												,{' '}
												{formatPrice(
													item.unitPrice,
													item.currency
												)}{' '}
												cada
											</p>
										</div>
										<p className='shrink-0 self-start text-sm font-semibold tabular-nums'>
											{formatPrice(
												item.unitPrice * item.quantity,
												item.currency
											)}
										</p>
									</div>
								</li>
							))}
							<li className='flex items-center justify-between gap-3 border-t border-border/70 bg-muted/35 px-4 py-3.5'>
								<span className='text-sm text-muted-foreground'>
									Total do pedido
								</span>
								<span className='font-heading text-lg font-bold tabular-nums tracking-tight'>
									{formatPrice(order.total, order.currency)}
								</span>
							</li>
						</ul>
					</section>

					<section
						className='space-y-3'
						aria-labelledby='order-store'
					>
						<h2
							id='order-store'
							className='font-heading text-sm font-semibold tracking-tight'
						>
							Loja
						</h2>
						<div className='flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4'>
							<div className='relative size-12 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border/60'>
								<Image
									src={
										order.storeAvatar ?? STORE_PLACEHOLDER
									}
									alt=''
									fill
									placeholder='blur'
									blurDataURL={BLUR_PLACEHOLDER}
									sizes='48px'
									className='object-cover'
								/>
							</div>
							<div className='min-w-0 flex-1'>
								<p className='truncate font-semibold'>
									{order.storeName}
								</p>
								<p className='text-xs text-muted-foreground'>
									Contacto directo com o vendedor
								</p>
							</div>
							{order.storeSlug ? (
								<Button
									variant='outline'
									size='sm'
									className='min-h-10 shrink-0 rounded-full'
									render={
										<Link
											href={`/lojas/${order.storeSlug}`}
										/>
									}
								>
									<Store className='size-3.5' aria-hidden />
									Ver loja
								</Button>
							) : null}
						</div>
					</section>

					<section
						className='hidden flex-col gap-2 sm:flex lg:flex-row'
						aria-label='Acções do pedido'
					>
						{order.conversationId ? (
							<Button
								className='min-h-11 flex-1 rounded-xl'
								render={
									<Link
										href={`/mensagens/${order.conversationId}`}
									/>
								}
							>
								<MessageCircle className='size-4' aria-hidden />
								Falar com a loja
							</Button>
						) : null}
						{showBuyAgain ? (
							<Button
								variant='outline'
								className='min-h-11 flex-1 rounded-xl'
								render={
									<Link href={`/product/${firstProductId}`} />
								}
							>
								<RotateCcw className='size-4' aria-hidden />
								Comprar de novo
							</Button>
						) : null}
					</section>
				</div>

				<aside className='order-1 w-full shrink-0 space-y-3 lg:sticky lg:top-24 lg:order-2 lg:w-[min(100%,24rem)] xl:w-104'>
					{canReview ? (
						<OrderReviewForm
							orderId={order.id}
							storeName={order.storeName}
							items={items}
							onSubmitted={() => {
								void queryClient.invalidateQueries({
									queryKey: ['order', id],
								})
								void queryClient.invalidateQueries({
									queryKey: ['orders'],
								})
							}}
						/>
					) : alreadyReviewed && review ? (
						<OrderReviewSummary
							storeName={order.storeName}
							storeAvatar={order.storeAvatar}
							review={review}
						/>
					) : alreadyReviewed ? (
						<div className='rounded-2xl border border-emerald-500/20 bg-emerald-500/6 p-5'>
							<p className='font-heading text-base font-semibold tracking-tight'>
								Já avaliaste este pedido
							</p>
							<p className='mt-1 text-sm text-muted-foreground'>
								A tua opinião sobre {order.storeName} já está
								registada.
							</p>
						</div>
					) : order.status !== 'cancelled' ? (
						<OrderReviewWaitingPanel
							statusLabel={order.statusLabel}
						/>
					) : null}
				</aside>
			</div>

			{hasMobileActions ? (
				<div className='fixed inset-x-0 bottom-0 z-20 border-t border-border/60 bg-background/95 p-3 backdrop-blur-md supports-backdrop-filter:bg-background/85 sm:hidden'>
					<div className='mx-auto flex max-w-7xl gap-2 pb-[env(safe-area-inset-bottom)]'>
						{order.conversationId ? (
							<Button
								className='min-h-12 flex-1 rounded-xl'
								render={
									<Link
										href={`/mensagens/${order.conversationId}`}
									/>
								}
							>
								<MessageCircle className='size-4' aria-hidden />
								Falar com a loja
							</Button>
						) : order.storeSlug ? (
							<Button
								className='min-h-12 flex-1 rounded-xl'
								render={
									<Link href={`/lojas/${order.storeSlug}`} />
								}
							>
								<Store className='size-4' aria-hidden />
								Ver loja
							</Button>
						) : null}
						{showBuyAgain ? (
							<Button
								variant='outline'
								className='min-h-12 flex-1 rounded-xl'
								render={
									<Link href={`/product/${firstProductId}`} />
								}
							>
								<RotateCcw className='size-4' aria-hidden />
								Comprar de novo
							</Button>
						) : null}
					</div>
				</div>
			) : null}
		</div>
	)
}
