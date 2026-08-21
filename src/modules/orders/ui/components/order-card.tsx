'use client'
import { MessageCircle, RotateCcw, Star, Store } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { PRODUCT_PLACEHOLDER, STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { BuyerOrder } from '@/types'
import { formatPrice } from '@/utils/format-price'

type OrderCardProps = {
	order: BuyerOrder
}
function primaryAction(order: BuyerOrder): {
	label: string
	href: string
	icon: typeof Store
} {
	if (order.status === 'completed' && order.reviewEligible) {
		return {
			label: 'Avaliar',
			href: `/feed/pedidos/${order.id}`,
			icon: Star,
		}
	}
	if (order.status === 'completed') {
		const productId = order.itemsPreview[0]?.productId
		return {
			label: 'Comprar de novo',
			href: productId
				? `/product/${productId}`
				: order.storeSlug
					? `/lojas/${order.storeSlug}`
					: `/feed/pedidos/${order.id}`,
			icon: RotateCcw,
		}
	}
	if (order.conversationId) {
		return {
			label: 'Falar com a loja',
			href: `/mensagens/${order.conversationId}`,
			icon: MessageCircle,
		}
	}
	if (order.storeSlug) {
		return {
			label: 'Ver loja',
			href: `/lojas/${order.storeSlug}`,
			icon: Store,
		}
	}
	return {
		label: 'Ver detalhes',
		href: `/feed/pedidos/${order.id}`,
		icon: Store,
	}
}
export function OrderCard({ order }: OrderCardProps) {
	const action = primaryAction(order)
	const ActionIcon = action.icon
	const preview = order.itemsPreview
	const title =
		preview.length === 0
			? order.storeName
			: preview.length === 1
				? preview[0]?.productName
				: `${preview[0]?.productName} +${preview.length - 1}`
	return (
		<Card
			size='sm'
			className='gap-0 py-0 transition-[border-color,box-shadow] duration-200 hover:border-border hover:shadow-sm'
		>
			<CardContent className='p-0'>
				<Link
					href={`/feed/pedidos/${order.id}`}
					className='flex gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
				>
					<div className='relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-20'>
						<Image
							src={
								preview[0]?.imageUrl ??
								order.storeAvatar ??
								PRODUCT_PLACEHOLDER
							}
							alt=''
							fill
							placeholder='blur'
							blurDataURL={BLUR_PLACEHOLDER}
							sizes='80px'
							className='object-cover'
						/>
						{preview.length > 1 ? (
							<span className='absolute right-1 bottom-1 rounded-md bg-background/90 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums shadow-sm'>
								+{preview.length - 1}
							</span>
						) : null}
					</div>

					<div className='min-w-0 flex-1 space-y-1.5'>
						<div className='flex items-start justify-between gap-2'>
							<div className='min-w-0'>
								<p className='truncate font-semibold text-foreground'>
									{title}
								</p>
								<p className='mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground'>
									<span className='relative size-4 shrink-0 overflow-hidden rounded-full'>
										<Image
											src={
												order.storeAvatar ??
												STORE_PLACEHOLDER
											}
											alt=''
											fill
											sizes='16px'
											className='object-cover'
										/>
									</span>
									<span className='truncate'>
										{order.storeName}
									</span>
								</p>
							</div>
							<OrderStatusBadge
								status={order.status}
								label={order.statusLabel}
								className='shrink-0'
							/>
						</div>

						<p className='text-[11px] leading-snug text-muted-foreground sm:text-xs'>
							Pedido #{order.shortId}, {order.date}
							{order.itemCount > 0
								? `, ${order.itemCount} ite${order.itemCount !== 1 ? 'ns' : 'm'}`
								: ''}
						</p>

						<p className='font-bold tabular-nums text-foreground'>
							{formatPrice(order.total, order.currency)}
						</p>
					</div>
				</Link>
			</CardContent>

			<CardFooter className='flex flex-wrap items-center justify-between gap-2 border-t border-border/60 py-3'>
				<Button
					variant='ghost'
					size='sm'
					className='min-h-9 rounded-full px-3'
					render={<Link href={`/feed/pedidos/${order.id}`} />}
				>
					Ver detalhes
				</Button>
				<Button
					size='sm'
					variant={
						action.href.startsWith('/mensagens')
							? 'secondary'
							: order.status === 'completed'
								? 'default'
								: 'secondary'
					}
					className={
						action.href.startsWith('/mensagens')
							? 'min-h-9 rounded-full px-3 shadow-[0_4px_14px_-6px_color-mix(in_oklch,#e8340a_50%,transparent)]'
							: 'min-h-9 rounded-full px-3'
					}
					render={<Link href={action.href} />}
				>
					<ActionIcon className='size-3.5' aria-hidden />
					{action.label}
				</Button>
			</CardFooter>
		</Card>
	)
}
