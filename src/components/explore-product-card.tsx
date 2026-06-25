'use client'

import { Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ExploreProduct } from '@/types/marketplace'
import { PRODUCT_PLACEHOLDER } from '@/lib/api/marketplace'
import { formatPrice } from '@/utils/format-price'

interface ExploreProductCardProps {
	product: ExploreProduct
	className?: string
}

export const ExploreProductCard = ({
	product,
	className,
}: ExploreProductCardProps) => {
	return (
		<Link
			href={`/product/${product.id}`}
			className={cn(
				'group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border',
				className
			)}
		>
			<div className='relative aspect-4/5 overflow-hidden bg-muted'>
				<Image
					src={product.image ?? PRODUCT_PLACEHOLDER}
					alt={product.name}
					fill
					sizes='(max-width: 640px) 50vw, 25vw'
					className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
				/>
				{product.hasDelivery && (
					<Badge className='absolute bottom-3 left-3 gap-1 border-0 bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white'>
						<Truck className='size-3' />
						Entrega
					</Badge>
				)}
			</div>

			<div className='space-y-1.5 p-3.5'>
				<h3 className='line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-secondary'>
					{product.name}
				</h3>
				<div className='flex flex-wrap items-baseline gap-1.5'>
					<span className='text-sm font-bold text-foreground'>
						{formatPrice(product.price, product.currency)}
					</span>
					{product.negotiable && (
						<span className='text-xs text-muted-foreground'>negociável</span>
					)}
				</div>
			</div>
		</Link>
	)
}
