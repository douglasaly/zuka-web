'use client'

import {
	ArrowRight,
	MessageCircle,
	Package,
	Star,
	Truck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	PRODUCT_PLACEHOLDER,
	STORE_PLACEHOLDER,
} from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { BuyerOrder, StatusFilter } from '@/modules/orders/types'
import { cn } from '@/lib/utils'

type OrdersAsideProps = {
	pendingReviews: BuyerOrder[]
	pendingReviewCount: number
	recentOrder: BuyerOrder | null
	statusCounts: Record<StatusFilter, number>
	onStatusChange: (status: StatusFilter) => void
	className?: string
}

export function OrdersAside({
	pendingReviews,
	pendingReviewCount,
	recentOrder,
	statusCounts,
	onStatusChange,
	className,
}: OrdersAsideProps) {
	const inTransit = statusCounts.shipping
	const processing = statusCounts.pending
	const hasActivity = pendingReviewCount > 0 || inTransit > 0 || processing > 0

	return (
		<aside
			className={cn(
				'flex w-full flex-col gap-4 lg:sticky lg:top-24 lg:w-[min(100%,22rem)] xl:w-96',
				className
			)}
			aria-label='Resumo e próximos passos'
		>
			{pendingReviewCount > 0 ? (
				<section className='overflow-hidden rounded-2xl bg-secondary text-secondary-foreground shadow-[0_12px_32px_-16px_color-mix(in_oklch,#e8340a_65%,transparent)]'>
					<div className='space-y-1 px-5 pt-5 pb-3'>
						<div className='flex items-center gap-2'>
							<Star className='size-4 fill-current' aria-hidden />
							<h2 className='font-heading text-base font-bold tracking-tight'>
								{pendingReviewCount === 1
									? '1 avaliação por fazer'
									: `${pendingReviewCount} avaliações por fazer`}
							</h2>
						</div>
						<p className='text-sm text-secondary-foreground/85'>
							A tua opinião ajuda outros compradores. Avalia
							directamente no pedido.
						</p>
					</div>

					<ul className='divide-y divide-white/15 border-t border-white/15'>
						{pendingReviews.slice(0, 3).map((order) => {
							const preview = order.itemsPreview[0]
							const title =
								preview?.productName ?? order.storeName

							return (
								<li key={order.id}>
									<Link
										href={`/feed/pedidos/${order.id}`}
										className='flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none'
									>
										<div className='relative size-11 shrink-0 overflow-hidden rounded-xl bg-white/15'>
											<Image
												src={
													preview?.imageUrl ??
													order.storeAvatar ??
													PRODUCT_PLACEHOLDER
												}
												alt=''
												fill
												placeholder='blur'
												blurDataURL={BLUR_PLACEHOLDER}
												sizes='44px'
												className='object-cover'
											/>
										</div>
										<div className='min-w-0 flex-1'>
											<p className='truncate text-sm font-semibold'>
												{title}
											</p>
											<p className='mt-0.5 truncate text-xs text-secondary-foreground/75'>
												{order.storeName}, Pedido #
												{order.shortId}
											</p>
										</div>
										<span className='shrink-0 text-xs font-semibold underline-offset-2'>
											Avaliar
										</span>
									</Link>
								</li>
							)
						})}
					</ul>

					{pendingReviewCount > pendingReviews.slice(0, 3).length ? (
						<p className='px-5 py-3 text-xs text-secondary-foreground/75'>
							+
							{pendingReviewCount -
								pendingReviews.slice(0, 3).length}{' '}
							à espera de avaliação
						</p>
					) : null}
				</section>
			) : null}

			{hasActivity ? (
				<section className='rounded-2xl border border-border/70 bg-card p-5'>
					<h2 className='font-heading text-sm font-semibold tracking-tight'>
						Em andamento
					</h2>
					<p className='mt-1 text-sm text-muted-foreground'>
						Filtra a lista para ver só o que precisa da tua atenção.
					</p>

					<div className='mt-4 space-y-2'>
						{processing > 0 ? (
							<button
								type='button'
								onClick={() => onStatusChange('pending')}
								className='flex min-h-11 w-full items-center gap-3 rounded-xl bg-amber-500/10 px-3.5 text-left transition-colors hover:bg-amber-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								<span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-amber-800 dark:text-amber-300'>
									<Package className='size-4' aria-hidden />
								</span>
								<span className='min-w-0 flex-1'>
									<span className='block text-sm font-medium text-foreground'>
										Em processamento
									</span>
									<span className='block text-xs text-muted-foreground'>
										{processing === 1
											? '1 pedido com a loja'
											: `${processing} pedidos com a loja`}
									</span>
								</span>
								<ArrowRight
									className='size-4 shrink-0 text-muted-foreground'
									aria-hidden
								/>
							</button>
						) : null}

						{inTransit > 0 ? (
							<button
								type='button'
								onClick={() => onStatusChange('shipping')}
								className='flex min-h-11 w-full items-center gap-3 rounded-xl bg-sky-500/10 px-3.5 text-left transition-colors hover:bg-sky-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								<span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-sky-800 dark:text-sky-300'>
									<Truck className='size-4' aria-hidden />
								</span>
								<span className='min-w-0 flex-1'>
									<span className='block text-sm font-medium text-foreground'>
										Em envio
									</span>
									<span className='block text-xs text-muted-foreground'>
										{inTransit === 1
											? '1 pedido a caminho'
											: `${inTransit} pedidos a caminho`}
									</span>
								</span>
								<ArrowRight
									className='size-4 shrink-0 text-muted-foreground'
									aria-hidden
								/>
							</button>
						) : null}
					</div>
				</section>
			) : null}

			<section className='relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-br from-foreground to-foreground/90 p-5 text-background'>
				<div
					aria-hidden
					className='pointer-events-none absolute -top-10 -right-8 size-36 rounded-full bg-secondary/35 blur-2xl'
				/>
				<div className='relative space-y-3'>
					<h2 className='font-heading text-lg font-bold tracking-tight'>
						Continuar a explorar
					</h2>
					<p className='text-sm leading-relaxed text-background/75'>
							Descobre produtos locais e fala directamente com as
							lojas, isso tudo sem sair do Zuka.
					</p>
					<div className='flex flex-col gap-2 pt-1'>
						<Button
							className='min-h-11 w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90'
							render={<Link href='/mensagens' />}
						>
							<MessageCircle className='size-4' aria-hidden />
							Abrir mensagens
						</Button>
						<Button
							variant='ghost'
							className='min-h-11 w-full rounded-xl text-background hover:bg-white/10 hover:text-background'
							render={<Link href='/feed/explorar' />}
						>
							Explorar produtos
							<ArrowRight className='size-4' aria-hidden />
						</Button>
					</div>
				</div>
			</section>

			{recentOrder ? (
				<section className='rounded-2xl border border-dashed border-border/80 bg-muted/25 p-4'>
					<p className='text-xs font-medium text-foreground'>Dica</p>
					<ul className='mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground'>
						<li>
							Depois da entrega, avalia na página do pedido.
						</li>
						<li>A resposta da loja aparece aí também.</li>
					</ul>
					<div className='mt-3 flex items-center gap-2'>
						<div className='relative size-7 overflow-hidden rounded-full bg-muted'>
							<Image
								src={
									recentOrder.storeAvatar ?? STORE_PLACEHOLDER
								}
								alt=''
								fill
								sizes='28px'
								className='object-cover'
							/>
						</div>
						<p className='truncate text-xs text-muted-foreground'>
							Última loja: {recentOrder.storeName}
						</p>
					</div>
				</section>
			) : null}
		</aside>
	)
}
