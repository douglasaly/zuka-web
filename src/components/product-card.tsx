'use client'

import { Heart, Store, Truck } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSavedItems } from '@/hooks/use-saved-items'
import type { Product } from '@/lib/api/Product'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'

type ProductCardProps = {
	product: Product
	variant?: 'default' | 'horizontal'
}

export const ProductCard = ({
	product,
	variant = 'default',
}: ProductCardProps) => {
	const router = useRouter()
	const { toggleSavedItem, isSaving, isSaved } = useSavedItems()

	function handleSaveItem(itemId: string) {
		toggleSavedItem(itemId)
	}

	const saved = isSaved(product.id)
	const isHorizontal = variant === 'horizontal'

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
			className={cn(
				'group cursor-pointer gap-0 overflow-hidden rounded-2xl border border-border/60 bg-card p-0 transition-all duration-300 hover:border-border',
				isHorizontal
					? 'flex flex-row items-stretch'
					: 'hover:-translate-y-0.5'
			)}
		>
			<div
				className={cn(
					'relative overflow-hidden',
					isHorizontal ? 'h-auto w-28 shrink-0 sm:w-32' : 'w-full'
				)}
			>
				<div
					className={cn(
						'relative w-full bg-muted',
						isHorizontal ? 'h-full' : 'aspect-4/5'
					)}
				>
					<Image
						loading='lazy'
						src={product.image ?? '/product-placeholder.jpg'}
						alt={product.name}
						fill
						sizes={
							isHorizontal
								? '128px'
								: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
						}
						className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
					/>
				</div>

				{hasDiscount && discountPercent && (
					<Badge className='absolute left-2 top-2 border-0 bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground'>
						-{discountPercent}%
					</Badge>
				)}

				<Button
					variant='secondary'
					size='icon-sm'
					type='button'
					onClick={(e) => {
						e.stopPropagation()
						handleSaveItem(product.id)
					}}
					disabled={isSaving}
					className={cn(
						'absolute right-2 top-2 size-8 rounded-full border border-border/50 bg-background/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:[&svg]:text-white',
						(saved || isHorizontal) && 'opacity-100'
					)}
					aria-label='Adicionar aos favoritos'
				>
					<Heart
						className={cn(
							'size-3.5 text-foreground',
							saved && 'size-4 fill-red-500 text-red-500'
						)}
					/>
				</Button>

				{!isHorizontal && (
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
				)}
			</div>

			<CardContent
				className={cn(
					isHorizontal
						? 'flex flex-1 flex-col justify-center gap-1.5 px-4 py-3'
						: 'space-y-2 px-4 pb-4 pt-3.5'
				)}
			>
				<h3
					className={cn(
						'font-semibold leading-snug text-foreground transition-colors group-hover:text-secondary',
						isHorizontal
							? 'line-clamp-1 text-sm'
							: 'line-clamp-2 text-sm'
					)}
				>
					{product.name}
				</h3>

				<div className='flex items-baseline gap-2'>
					<span
						className={cn(
							'font-bold text-foreground',
							isHorizontal ? 'text-sm' : 'text-base'
						)}
					>
						{formatPrice(finalPrice, product.currency)}
					</span>
					{hasDiscount && (
						<span className='text-xs text-muted-foreground line-through'>
							{formatPrice(product.price, product.currency)}
						</span>
					)}
				</div>

				{isHorizontal && product.hasDelivery && (
					<span className='flex items-center gap-1 text-xs text-emerald-700'>
						<Truck className='size-3' />
						Entrega disponível
					</span>
				)}
			</CardContent>
		</Card>
	)
}
