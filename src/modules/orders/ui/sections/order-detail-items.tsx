'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { PRODUCT_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { BuyerOrder, BuyerOrderItem } from '@/modules/orders/types'
import { formatPrice } from '@/utils/format-price'

type OrderDetailItemsProps = {
	order: BuyerOrder
	items: BuyerOrderItem[]
}

export function OrderDetailItems({ order, items }: OrderDetailItemsProps) {
	return (
		<section className='space-y-3' aria-labelledby='order-items'>
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
									src={item.imageUrl ?? PRODUCT_PLACEHOLDER}
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
									{formatPrice(item.unitPrice, item.currency)}{' '}
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
	)
}
