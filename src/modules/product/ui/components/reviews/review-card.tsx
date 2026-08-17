'use client'
import { BadgeCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { formatLongPtDate } from '@/utils/format-date'
import { StarRating } from './star-rating'
import type { ProductReviewsStore, PublicProductReview } from './types'

function formatReviewDate(iso: string) {
	return formatLongPtDate(iso)
}
function Initials({ name }: { name: string }) {
	const initials = name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((n) => n[0]?.toUpperCase() ?? '')
		.join('')
	return (
		<div
			className='flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground'
			aria-hidden
		>
			{initials || '?'}
		</div>
	)
}
export function PublicReviewCard({ review }: { review: PublicProductReview }) {
	return (
		<article className='rounded-2xl border border-border/60 bg-card p-4 sm:p-5'>
			<header className='flex items-start gap-3'>
				<Initials name={review.buyerName} />
				<div className='min-w-0 flex-1'>
					<div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
						<p className='font-medium text-foreground'>
							{review.buyerName}
						</p>
						<span className='rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'>
							Compra confirmada
						</span>
					</div>
					<div className='mt-1.5 flex flex-wrap items-center gap-2'>
						<StarRating rating={review.rating} />
						<time
							dateTime={review.createdAt}
							className='text-xs text-muted-foreground'
						>
							{formatReviewDate(review.createdAt)}
						</time>
					</div>
				</div>
			</header>

			{review.body ? (
				<p className='mt-3 max-w-prose text-sm leading-relaxed text-foreground'>
					{review.body}
				</p>
			) : null}

			{review.storeReply ? (
				<aside className='mt-4 rounded-xl bg-muted/50 px-3.5 py-3'>
					<div className='flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5'>
						<p className='text-xs font-semibold text-foreground'>
							Resposta da loja
						</p>
						{review.storeRepliedAt ? (
							<time
								dateTime={review.storeRepliedAt}
								className='text-xs text-muted-foreground'
							>
								{formatReviewDate(review.storeRepliedAt)}
							</time>
						) : null}
					</div>
					<p className='mt-2 max-w-prose text-sm leading-relaxed text-foreground'>
						{review.storeReply}
					</p>
				</aside>
			) : null}
		</article>
	)
}
export function StoreReviewsRef({ store }: { store: ProductReviewsStore }) {
	return (
		<section
			aria-label='Loja'
			className='rounded-2xl border border-border/60 bg-card p-4'
		>
			<div className='flex items-center gap-3'>
				<div className='relative size-11 shrink-0 overflow-hidden rounded-full bg-muted'>
					<Image
						src={store.avatarUrl ?? STORE_PLACEHOLDER}
						alt={`Logo de ${store.name}`}
						fill
						sizes='44px'
						placeholder='blur'
						blurDataURL={BLUR_PLACEHOLDER}
						className='object-cover'
					/>
				</div>
				<div className='min-w-0 flex-1'>
					<div className='flex flex-wrap items-center gap-1.5'>
						<p className='truncate font-semibold'>{store.name}</p>
						{store.verified ? (
							<span className='inline-flex items-center gap-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400'>
								<BadgeCheck className='size-3.5' aria-hidden />
								Verificada
							</span>
						) : null}
					</div>
					{store.rating != null && store.reviewCount > 0 ? (
						<div className='mt-0.5 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground'>
							<span>Nota da loja</span>
							<StarRating rating={store.rating} size='sm' />
							<span className='tabular-nums'>
								{store.rating.toFixed(1)},{' '}
								{store.reviewCount === 1
									? '1 avaliação'
									: `${store.reviewCount} avaliações`}
							</span>
						</div>
					) : (
						<p className='mt-0.5 text-sm text-muted-foreground'>
							Ainda sem nota da loja
						</p>
					)}
				</div>
			</div>
			<div className='mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border/50 pt-3 text-sm'>
				<Link
					href={`/lojas/${store.slug}`}
					className='inline-flex min-h-11 items-center font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
				>
					Ver loja
				</Link>
				<Link
					href={`/lojas/${store.slug}?tab=reviews`}
					className='inline-flex min-h-11 items-center text-muted-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
				>
					Ver avaliações da loja
				</Link>
			</div>
		</section>
	)
}
