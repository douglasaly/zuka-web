import { Truck } from 'lucide-react'
import { formatPrice } from '@/utils/format-price'

type ProductPriceProps = {
	price: number
	discountPrice?: number | null
	currency: string
	negotiable?: boolean
	hasDelivery?: boolean
}

export const ProductPrice = ({
	price,
	discountPrice,
	currency,
	negotiable,
	hasDelivery,
}: ProductPriceProps) => (
	<div className='space-y-2'>
		<div className='flex flex-wrap items-baseline gap-2'>
			<span className='text-2xl font-bold'>
				{formatPrice(discountPrice ?? price, currency)}
			</span>
			{discountPrice != null && (
				<span className='text-sm text-muted-foreground line-through'>
					{formatPrice(price, currency)}
				</span>
			)}
			{negotiable && (
				<span className='text-sm text-muted-foreground'>
					Negociável
				</span>
			)}
		</div>

		{hasDelivery && (
			<div className='flex items-center gap-2 text-sm font-medium text-emerald-700'>
				<Truck className='size-4' />
				Entrega disponível
			</div>
		)}
	</div>
)
