import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PRODUCT_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { formatPrice } from '@/utils/format-price'
import type { ProductReviewsResponse } from '../components/reviews/types'

type ProductReviewsHeaderProps = {
	product: ProductReviewsResponse['product']
}
export function ProductReviewsHeader({ product }: ProductReviewsHeaderProps) {
	return (
		<>
			<Link
				href={`/product/${product.id}`}
				className='inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
			>
				<ArrowLeft className='size-4' aria-hidden />
				Voltar ao produto
			</Link>

			<header className='flex gap-3 sm:gap-4'>
				<Link
					href={`/product/${product.id}`}
					className='relative aspect-square size-20 shrink-0 overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:size-24'
				>
					<Image
						src={product.image ?? PRODUCT_PLACEHOLDER}
						alt={`Foto de ${product.name}`}
						fill
						sizes='96px'
						placeholder='blur'
						blurDataURL={BLUR_PLACEHOLDER}
						className='object-cover'
						priority
					/>
				</Link>
				<div className='min-w-0 flex-1'>
					{product.categoryName ? (
						<p className='text-xs text-muted-foreground'>
							{product.categoryName}
						</p>
					) : null}
					<h1 className='mt-0.5 font-heading text-xl font-bold tracking-tight sm:text-2xl'>
						Avaliações
					</h1>
					<p className='mt-0.5 line-clamp-2 text-sm text-muted-foreground'>
						{product.name}
					</p>
					<p className='mt-2 text-sm font-semibold tabular-nums'>
						{formatPrice(
							product.discountPrice ?? product.price,
							product.currency
						)}
						{product.discountPrice != null ? (
							<span className='ml-2 font-normal text-muted-foreground line-through'>
								{formatPrice(product.price, product.currency)}
							</span>
						) : null}
					</p>
				</div>
			</header>
		</>
	)
}
