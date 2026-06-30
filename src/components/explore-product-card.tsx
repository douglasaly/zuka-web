'use client'

import { Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PRODUCT_PLACEHOLDER } from '@/lib/api/marketplace'
import { cn } from '@/lib/utils'
import type { ExploreProduct } from '@/types/marketplace'
import { formatPrice } from '@/utils/format-price'

interface ExploreProductCardProps {
	product: ExploreProduct
	className?: string
	variant?: 'default' | 'compact'
}

export const ExploreProductCard = ({
	product,
	className,
	variant = 'default',
}: ExploreProductCardProps) => {
	const isCompact = variant === 'compact'

	return (
		<Link
			href={`/product/${product.id}`}
			className={cn(
				'group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border',
				className
			)}
		>
			<div
				className={cn(
					'relative overflow-hidden bg-muted',
					isCompact ? 'aspect-square' : 'aspect-4/5'
				)}
			>
				<Image
					src={product.image ?? PRODUCT_PLACEHOLDER}
					alt={product.name}
					fill
					sizes={
						isCompact
							? '(max-width: 640px) 50vw, 25vw'
							: '(max-width: 640px) 50vw, 25vw'
					}
					className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
				/>
				{product.hasDelivery && (
					<Badge
						className={cn(
							'absolute gap-1 border-0 bg-emerald-600 font-semibold text-white',
							isCompact
								? 'bottom-2 left-2 px-1.5 py-0.5 text-[10px]'
								: 'bottom-3 left-3 px-2 py-0.5 text-[11px]'
						)}
					>
						<Truck className={isCompact ? 'size-2.5' : 'size-3'} />
						Entrega
					</Badge>
				)}
			</div>

			<div
				className={cn(
					'space-y-1',
					isCompact ? 'p-2.5' : 'space-y-1.5 p-3.5'
				)}
			>
				<h3
					className={cn(
						'font-semibold leading-snug text-foreground transition-colors group-hover:text-secondary',
						isCompact
							? 'line-clamp-1 text-xs'
							: 'line-clamp-2 text-sm'
					)}
				>
					{product.name}
				</h3>
				<div className='flex flex-wrap items-baseline gap-1.5'>
					<span
						className={cn(
							'font-bold text-foreground',
							isCompact ? 'text-xs' : 'text-sm'
						)}
					>
						{formatPrice(product.price, product.currency)}
					</span>
					{product.negotiable && !isCompact && (
						<span className='text-xs text-muted-foreground'>
							negociável
						</span>
					)}
				</div>
			</div>
		</Link>
	)
}
