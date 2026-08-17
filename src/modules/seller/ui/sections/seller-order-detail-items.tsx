'use client'
import { formatPrice } from '@/utils/format-price'

type SellerOrderDetailItemsProps = {
	items: Array<{
		id: string
		quantity: number
		unitPrice: number
		currency: string
		productName: string
	}>
	total: number
	currency: string
}
export function SellerOrderDetailItems({
	items,
	total,
	currency,
}: SellerOrderDetailItemsProps) {
	return (
		<section className='rounded-xl border border-border bg-card p-5'>
			<p className='mb-3 text-xs font-medium text-muted-foreground'>
				Itens
			</p>
			<ul className='divide-y divide-border'>
				{items.map((item) => (
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
					{formatPrice(total, currency)}
				</span>
			</div>
		</section>
	)
}
