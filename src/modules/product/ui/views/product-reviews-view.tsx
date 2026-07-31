'use client'

/**
 * THESIS: Trust through readable proof — product context + store note + scannable list.
 * Refuses marketplace dump of every badge/filter without data.
 * OWN-WORLD: Zuka PDP language (max-w-4xl, rounded-2xl, amber stars, full-bleed mobile).
 * STORY: Orient on product → trust store → scan distribution → read confirmed purchases.
 * FIRST VIEWPORT: back link + product strip + average + store ref.
 * FORM: Dedicated Read surface extending product module; local extension of incumbent world.
 */

import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PRODUCT_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { cn } from '@/lib/utils'
import { useProductReviews } from '@/modules/product/hooks/use-product-reviews'
import { RatingDistribution } from '@/modules/product/ui/components/reviews/rating-distribution'
import {
	PublicReviewCard,
	StoreReviewsRef,
} from '@/modules/product/ui/components/reviews/review-card'
import { ReviewsPagination } from '@/modules/product/ui/components/reviews/reviews-pagination'
import { StarRating } from '@/modules/product/ui/components/reviews/star-rating'
import { ProductReviewsToolbar } from '@/modules/product/ui/sections/product-reviews-toolbar'
import { formatPrice } from '@/utils/format-price'

type ProductReviewsViewProps = {
	productId: string
}

export function ProductReviewsView({ productId }: ProductReviewsViewProps) {
	const {
		page,
		rating,
		sort,
		search,
		setSearch,
		setPage,
		setRating,
		setSort,
		clearFilters,
		data,
		isLoading,
		isFetching,
		isError,
		refetch,
		isEmpty,
	} = useProductReviews(productId)

	if (isLoading && !data) {
		return <ReviewsPageSkeleton />
	}

	if (isError && !data) {
		return (
			<div className='mx-auto flex min-h-[50vh] max-w-4xl flex-col items-center justify-center gap-4 px-4'>
				<h1 className='font-heading text-lg font-bold'>
					Não foi possível carregar as avaliações
				</h1>
				<p className='max-w-md text-center text-sm text-muted-foreground'>
					Verifica a ligação e tenta outra vez.
				</p>
				<Button
					variant='outline'
					className='rounded-full'
					onClick={() => refetch()}
				>
					Tentar novamente
				</Button>
			</div>
		)
	}

	if (!data) {
		return (
			<div className='mx-auto flex min-h-[50vh] max-w-4xl flex-col items-center justify-center gap-4 px-4'>
				<p className='text-muted-foreground'>Produto não encontrado.</p>
				<Button
					variant='outline'
					className='rounded-full'
					render={<Link href='/feed/explorar' />}
				>
					Voltar a explorar
				</Button>
			</div>
		)
	}

	const { product, store, summary, reviews, total, totalPages, perPage } =
		data

	const resultLabel =
		total === 0
			? 'Nenhuma avaliação encontrada'
			: total === 1
				? '1 avaliação'
				: `${total} avaliações`

	return (
		<div className='mx-auto max-w-4xl pb-12 pt-2'>
			<div className='space-y-6 px-4 md:px-0'>
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
									{formatPrice(
										product.price,
										product.currency
									)}
								</span>
							) : null}
						</p>
					</div>
				</header>

				{isEmpty ? (
					<section className='rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center'>
						<h2 className='font-heading text-lg font-bold'>
							Ainda sem avaliações
						</h2>
						<p className='mx-auto mt-2 max-w-md text-sm text-muted-foreground'>
							Quando alguém comprar e avaliar, a nota do produto
							aparece aqui.
						</p>
						<Button
							variant='outline'
							className='mt-6 rounded-full'
							render={<Link href={`/product/${product.id}`} />}
						>
							Voltar ao produto
						</Button>
					</section>
				) : (
					<>
						<section
							aria-label='Nota do produto'
							className='grid gap-5 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-start'
						>
							<div className='rounded-2xl border border-border/60 bg-card p-4 text-center sm:text-left'>
								<p className='text-4xl font-bold tabular-nums tracking-tight'>
									{summary.average.toFixed(1)}
								</p>
								<div className='mt-1 flex justify-center sm:justify-start'>
									<StarRating
										rating={summary.average}
										size='md'
									/>
								</div>
								<p className='mt-2 text-xs text-muted-foreground'>
									Nota do produto
								</p>
								<p className='text-sm tabular-nums text-muted-foreground'>
									{summary.count === 1
										? '1 avaliação'
										: `${summary.count} avaliações`}
								</p>
							</div>
							<RatingDistribution
								summary={summary}
								activeRating={rating}
								onSelectRating={setRating}
								interactive
							/>
						</section>

						{store ? <StoreReviewsRef store={store} /> : null}

						<ProductReviewsToolbar
							search={search}
							onSearchChange={setSearch}
							sort={sort}
							onSortChange={setSort}
							activeRating={rating}
							onClearRating={() => setRating(null)}
							resultLabel={resultLabel}
						/>

						<div
							className={cn(
								'space-y-3 transition-opacity duration-200 ease-out',
								isFetching && !isLoading && 'opacity-60'
							)}
							aria-busy={isFetching && !isLoading}
						>
							{reviews.length === 0 ? (
								<div className='rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center'>
									<p className='text-sm text-muted-foreground'>
										Nenhuma avaliação corresponde aos
										filtros actuais.
									</p>
									<Button
										variant='ghost'
										size='sm'
										className='mt-3 rounded-full'
										onClick={clearFilters}
									>
										Limpar filtros
									</Button>
								</div>
							) : (
								reviews.map((review) => (
									<PublicReviewCard
										key={review.id}
										review={review}
									/>
								))
							)}
						</div>

						<ReviewsPagination
							currentPage={page}
							totalPages={totalPages}
							total={total}
							perPage={perPage}
							onPageChange={setPage}
						/>
					</>
				)}
			</div>
		</div>
	)
}

function ReviewsPageSkeleton() {
	return (
		<div
			className='mx-auto max-w-4xl space-y-5 px-4 pt-4 md:px-0'
			aria-busy='true'
			aria-label='A carregar avaliações'
		>
			<Skeleton className='h-5 w-36' />
			<div className='flex gap-4'>
				<Skeleton className='size-24 rounded-xl' />
				<div className='flex-1 space-y-2'>
					<Skeleton className='h-7 w-40' />
					<Skeleton className='h-4 w-full max-w-xs' />
					<Skeleton className='h-4 w-24' />
				</div>
			</div>
			<div className='grid gap-4 sm:grid-cols-[11rem_1fr]'>
				<Skeleton className='h-28 rounded-2xl' />
				<Skeleton className='h-28 rounded-2xl' />
			</div>
			{Array.from({ length: 3 }).map((_, i) => (
				<Skeleton key={i} className='h-36 w-full rounded-2xl' />
			))}
		</div>
	)
}
