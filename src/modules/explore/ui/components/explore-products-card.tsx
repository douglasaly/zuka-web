'use client'

import { Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { StoreAvatar } from '@/components/store-avatar'
import { Badge } from '@/components/ui/badge'
import { PRODUCT_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER, STORE_PLACEHOLDER } from '@/lib/constants/images'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/marketplace'
import { formatPrice } from '@/utils/format-price'

interface ExploreProductCardProps {
	product: Product
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
		<div
			className={cn(
				'group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-border',
				isCompact
					? 'flex flex-row items-stretch hover:translate-y-0'
					: 'flex flex-col hover:-translate-y-0.5',
				className
			)}
		>
			<Link
				href={`/product/${product.id}`}
				className='absolute inset-0 z-10'
				aria-label={product.name}
			/>

			<div
				className={cn(
					'relative overflow-hidden bg-muted',
					isCompact
						? 'h-auto w-28 shrink-0 sm:w-32'
						: 'aspect-4/5 w-full'
				)}
			>
				<Image
					src={product.image ?? PRODUCT_PLACEHOLDER}
					alt={product.name}
					fill
					placeholder='blur'
					blurDataURL={BLUR_PLACEHOLDER}
					sizes={
						isCompact ? '128px' : '(max-width: 640px) 50vw, 25vw'
					}
					className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
				/>

				{product.hasDelivery && !isCompact && (
					<Badge className='absolute bottom-3 left-3 gap-1 border-0 bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white'>
						<Truck className='size-3' />
						Entrega
					</Badge>
				)}
			</div>

			<div
				className={cn(
					isCompact
						? 'flex flex-1 flex-col justify-center gap-1.5 px-4 py-3'
						: 'space-y-1.5 p-3.5'
				)}
			>
				<h3
					className={cn(
						'font-semibold leading-snug text-foreground transition-colors group-hover:text-secondary',
						isCompact
							? 'line-clamp-1 text-sm'
							: 'line-clamp-2 text-sm'
					)}
				>
					{product.name}
				</h3>

				<Link
					href={`/lojas/${product.storeSlug}`}
					className='relative z-20 flex gap-1 items-center hover:underline w-fit'
				>
					<StoreAvatar
						name={product.storeName}
						imageUrl={product.storeAvatar ?? STORE_PLACEHOLDER}
						size='xs'
						fClassName='text-[8px]'
					/>
					<p className='text-xs text-muted-foreground line-clamp-1'>
						{product.storeName}
					</p>
				</Link>

				<div className='flex flex-wrap items-baseline gap-1.5'>
					<span
						className={cn(
							'font-bold text-foreground',
							isCompact ? 'text-sm' : 'text-sm'
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

				{isCompact && product.hasDelivery && (
					<span className='flex items-center gap-1 text-xs text-emerald-700'>
						<Truck className='size-3' />
						Entrega disponível
					</span>
				)}
			</div>
		</div>
	)
}
