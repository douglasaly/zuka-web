import type { SellerProduct } from '@/types'
import { formatPrice } from '@/utils/format-price'
export function ProductPriceDisplay({ product }: { product: SellerProduct }) {
	const discount = product.discountPrice
	const hasDiscount = discount != null && discount > 0
	if (hasDiscount) {
		return (
			<span className='flex flex-wrap items-baseline gap-x-1.5 gap-y-0'>
				<span className='font-semibold tabular-nums text-primary'>
					{formatPrice(discount, product.currency)}
				</span>
				<span className='text-xs tabular-nums text-muted-foreground line-through'>
					{formatPrice(product.price, product.currency)}
				</span>
			</span>
		)
	}
	return (
		<span className='font-semibold tabular-nums text-primary'>
			{formatPrice(product.price, product.currency)}
		</span>
	)
}
