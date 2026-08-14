'use client'

import { Heart, ShoppingCart, Star, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { StoreAvatar } from '@/components/store-avatar'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/use-cart'
import { useSavedItems } from '@/hooks/use-saved-items'
import { PRODUCT_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER, STORE_PLACEHOLDER } from '@/lib/constants/images'
import { cn } from '@/lib/utils'
import { toCartProductInput } from '@/modules/cart/lib/cart-utils'
import type { Product } from '@/types/marketplace'
import { formatPrice } from '@/utils/format-price'

type ProductCardProps = {
	product: Product
	className?: string
	variant?: 'default' | 'compact'
	showStore?: boolean
	showFavorite?: boolean
}

function ProductCardFavoriteButton({
	productId,
	alwaysVisible,
}: {
	productId: string
	alwaysVisible: boolean
}) {
	const { toggleSavedItem, isSaving, isRemoving, isSaved } = useSavedItems()
	const saved = isSaved(productId)

	return (
		<IconTooltipButton
			label={saved ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
			variant='secondary'
			disabled={isSaving || isRemoving}
			aria-pressed={saved}
			onClick={(e) => {
				e.preventDefault()
				e.stopPropagation()
				toggleSavedItem(productId)
			}}
			className={cn(
				'absolute top-2 right-2 z-20 size-8 border border-border/50 bg-background/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:[&svg]:text-white',
				(saved || alwaysVisible) && 'opacity-100'
			)}
		>
			<Heart
				className={cn(
					'size-3.5 text-foreground',
					saved && 'size-4 fill-red-500 text-red-500'
				)}
			/>
		</IconTooltipButton>
	)
}

function ProductCardCartButton({
	product,
	alwaysVisible,
}: {
	product: Product
	alwaysVisible: boolean
}) {
	const { addItem } = useCart()

	return (
		<IconTooltipButton
			label='Adicionar ao carrinho'
			variant='secondary'
			onClick={(e) => {
				e.preventDefault()
				e.stopPropagation()
				addItem(toCartProductInput(product))
			}}
			className={cn(
				'absolute top-2 left-2 z-20 size-8 border border-border/50 bg-background/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:[&svg]:text-white',
				alwaysVisible && 'opacity-100'
			)}
		>
			<ShoppingCart className='size-3.5 text-foreground' />
		</IconTooltipButton>
	)
}

export const ProductCard = ({
	product,
	className,
	variant = 'default',
	showStore = true,
	showFavorite = false,
}: ProductCardProps) => {
	const isCompact = variant === 'compact'
	const reviewCount = product.reviewCount ?? 0
	const hasRating = reviewCount > 0 && product.rating != null
	const ratingLabel = hasRating
		? `${product.rating?.toFixed(1)} de 5, ${reviewCount === 1 ? '1 avaliação' : `${reviewCount} avaliações`}`
		: undefined

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
					<Badge className='absolute bottom-3 left-3 z-20 gap-1 border-0 bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white'>
						<Truck className='size-3' />
						Entrega
					</Badge>
				)}

				<ProductCardCartButton
					product={product}
					alwaysVisible={isCompact}
				/>

				{showFavorite && (
					<ProductCardFavoriteButton
						productId={product.id}
						alwaysVisible={isCompact}
					/>
				)}
			</div>

			<div
				className={cn(
					isCompact
						? 'flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-4 py-3'
						: 'space-y-1.5 p-3.5'
				)}
			>
				<div className='flex items-start justify-between gap-2'>
					<h3
						className={cn(
							'min-w-0 flex-1 font-semibold leading-snug text-foreground transition-colors group-hover:text-secondary',
							isCompact
								? 'line-clamp-1 text-sm'
								: 'line-clamp-2 text-sm'
						)}
					>
						{product.name}
					</h3>

					{hasRating && (
						<span className='flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground'>
							<span className='sr-only'>{ratingLabel}</span>
							<Star
								className='size-3 fill-amber-400 text-amber-400'
								aria-hidden
							/>
							<span className='font-medium text-foreground'>
								{product.rating?.toFixed(1)}
							</span>
							{isCompact && <span>({reviewCount})</span>}
						</span>
					)}
				</div>

				{showStore && (
					<Link
						href={`/lojas/${product.storeSlug}`}
						className='relative z-20 flex w-fit items-center gap-1 hover:underline'
					>
						<StoreAvatar
							name={product.storeName}
							imageUrl={product.storeAvatar ?? STORE_PLACEHOLDER}
							size='xs'
							fClassName='text-[8px]'
						/>
						<p className='line-clamp-1 text-xs text-muted-foreground'>
							{product.storeName}
						</p>
					</Link>
				)}

				<div className='flex flex-wrap items-baseline gap-1.5'>
					<span className='text-sm font-bold text-foreground'>
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
