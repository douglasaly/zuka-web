'use client'

import { Heart, Store, Truck } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/utils/format-price'

interface Product {
	id: string
	name: string
	price: number
	discountPrice?: number | null
	currency: string
	image?: string
	hasDelivery?: boolean
}

export const ProductCard = ({ product }: { product: Product }) => {
	const router = useRouter()

	const finalPrice = product.discountPrice ?? product.price
	const hasDiscount =
		product.discountPrice != null && product.discountPrice < product.price
	const discountPercent = hasDiscount
		? Math.round(
				((product.price - (product.discountPrice ?? 0)) /
					product.price) *
					100
			)
		: null

	return (
		<Card
			onClick={() => router.push(`/product/${product.id}`)}
			className='group cursor-pointer gap-0 overflow-hidden rounded-2xl border border-border/60 bg-card p-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-border'
		>
			<div className='relative overflow-hidden'>
				<div className='relative aspect-4/5 w-full bg-muted'>
					<Image
						loading='lazy'
						src={product.image ?? '/product-placeholder.jpg'}
						alt={product.name}
						fill
						sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
						className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
					/>
				</div>

				{hasDiscount && discountPercent && (
					<Badge className='absolute top-3 left-3 border-0 bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground'>
						-{discountPercent}%
					</Badge>
				)}

				<Button
					variant='secondary'
					size='icon-sm'
					type='button'
					onClick={(e) => e.stopPropagation()}
					className='absolute top-3 right-3 size-8 rounded-full border border-border/50 bg-background/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:[&svg]:text-white'
					aria-label='Adicionar aos favoritos'
				>
					<Heart className='size-3.5 text-black' />
				</Button>

				<Badge
					className={
						product.hasDelivery
							? 'absolute bottom-3 left-3 gap-1 border-0 bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white'
							: 'absolute bottom-3 left-3 gap-1 border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground'
					}
				>
					{product.hasDelivery ? (
						<>
							<Truck className='size-3' />
							Entrega
						</>
					) : (
						<>
							<Store className='size-3' />
							Levantamento
						</>
					)}
				</Badge>
			</div>

			<CardContent className='space-y-2 px-4 pt-3.5 pb-4'>
				<h3 className='line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-secondary'>
					{product.name}
				</h3>

				<div className='flex items-baseline gap-2'>
					<span className='text-base font-bold text-foreground'>
						{formatPrice(finalPrice, product.currency)}
					</span>
					{hasDiscount && (
						<span className='text-xs text-muted-foreground line-through'>
							{formatPrice(product.price, product.currency)}
						</span>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
