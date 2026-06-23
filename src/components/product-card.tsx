'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getBadge } from '@/utils/badge'
import { formatPrice } from '@/utils/format-price'

interface Product {
	id: string
	name: string
	price: number
	discountPrice?: number | null
	currency: string
	isVisible: boolean
	status: string
	image?: string
}

const badgeConfig = {
	promo: {
		label: '🔥 Promoção',
		className: 'bg-red-100 text-red-700',
	},
	active: {
		label: '🟢 Disponível',
		className: 'bg-green-100 text-green-700',
	},
	hidden: {
		label: '⚫ Indisponível',
		className: 'bg-gray-200 text-gray-600',
	},
}

export const ProductCard = ({ product }: { product: Product }) => {
	const router = useRouter()

	const badgeType = getBadge(product)
	const badge = badgeConfig[badgeType]

	const finalPrice = product.discountPrice ?? product.price

	return (
		<Card
			onClick={() => router.push(`/product/${product.id}`)}
			className='group cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg p-0'
		>
			{/* Image */}
			<div className='relative w-full'>
				<div className='relative w-full aspect-4/4.5 overflow-hidden bg-gray-50'>
					<Image
						loading='eager'
						src={product.image ?? '/product-placeholder.jpg'}
						alt={product.name}
						fill
						sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
						className='object-cover'
					/>
				</div>

				<Badge
					className={`absolute left-3 bottom-3 ${badge.className}`}
				>
					{badge.label}
				</Badge>
			</div>

			{/* Content */}
			<CardContent className='pb-4'>
				<h3 className='line-clamp-2 text-md font-semibold text-gray-800'>
					{product.name}
				</h3>

				<div className='mt-2 flex items-baseline gap-2'>
					<span className='text-lg font-bold text-gray-900'>
						{formatPrice(finalPrice, product.currency)}
					</span>

					{product.discountPrice &&
						product.discountPrice < product.price && (
							<span className='text-xs text-gray-400 line-through'>
								{formatPrice(product.price, product.currency)}
							</span>
						)}
				</div>
			</CardContent>
		</Card>
	)
}
