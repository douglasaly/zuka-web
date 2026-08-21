'use client'
import { MessageSquareText, PenLine } from 'lucide-react'
import Image from 'next/image'
import { PRODUCT_PLACEHOLDER, STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { BuyerOrderReview } from '@/types'
import { StarRating } from '@/modules/product/ui/components/reviews/star-rating'
import { formatLongPtDate } from '@/utils/format-date'

type OrderReviewSummaryProps = {
	storeName: string
	storeAvatar: string | null
	review: BuyerOrderReview
}
export function OrderReviewSummary({
	storeName,
	storeAvatar,
	review,
}: OrderReviewSummaryProps) {
	return (
		<section
			aria-labelledby='order-review-summary'
			className='rounded-2xl border border-border/70 bg-card p-5 sm:p-6'
		>
			<div className='flex items-start gap-3'>
				<span className='flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary-foreground text-emerald-700 dark:text-emerald-300'>
					<PenLine className='size-5' aria-hidden />
				</span>
				<div className='min-w-0 flex-1'>
					<h2
						id='order-review-summary'
						className='font-heading text-base font-semibold tracking-tight sm:text-lg'
					>
						A tua avaliação
					</h2>
					<p className='mt-1 text-sm text-muted-foreground'>
						Enviada a{' '}
						<time dateTime={review.createdAt}>
							{formatLongPtDate(review.createdAt)}
						</time>
					</p>
				</div>
			</div>

			<div className='mt-5 space-y-4'>
				<div className='rounded-xl bg-muted/35 p-4'>
					<p className='text-xs font-medium text-muted-foreground'>
						Atendimento da loja
					</p>
					<div className='mt-2 flex flex-wrap items-center gap-2'>
						<p className='truncate text-sm font-medium'>
							{storeName}
						</p>
						<StarRating rating={review.rating} size='md' />
					</div>
					{review.body ? (
						<p className='mt-2 text-sm leading-relaxed text-foreground'>
							{review.body}
						</p>
					) : null}
				</div>

				{review.products.map((product) => (
					<div
						key={product.productId}
						className='space-y-2 border-t border-border/60 pt-4'
					>
						<div className='flex items-center gap-3'>
							<div className='relative size-11 shrink-0 overflow-hidden rounded-xl bg-muted'>
								<Image
									src={
										product.imageUrl ?? PRODUCT_PLACEHOLDER
									}
									alt=''
									fill
									placeholder='blur'
									blurDataURL={BLUR_PLACEHOLDER}
									sizes='44px'
									className='object-cover'
								/>
							</div>
							<div className='min-w-0 flex-1'>
								<p className='truncate text-sm font-medium'>
									{product.productName}
								</p>
								<div className='mt-1'>
									<StarRating rating={product.rating} />
								</div>
							</div>
						</div>
						{product.body ? (
							<p className='text-sm leading-relaxed text-foreground'>
								{product.body}
							</p>
						) : null}
					</div>
				))}
			</div>

			{review.storeReply ? (
				<aside
					aria-label={`Resposta de ${storeName}`}
					className='mt-5 rounded-xl border border-border/60 bg-background p-4'
				>
					<div className='flex items-start gap-3'>
						<div className='relative size-9 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border/60'>
							<Image
								src={storeAvatar ?? STORE_PLACEHOLDER}
								alt=''
								fill
								placeholder='blur'
								blurDataURL={BLUR_PLACEHOLDER}
								sizes='36px'
								className='object-cover'
							/>
						</div>
						<div className='min-w-0 flex-1'>
							<div className='flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5'>
								<p className='text-sm font-semibold text-foreground'>
									{storeName}
								</p>
								{review.storeRepliedAt ? (
									<time
										dateTime={review.storeRepliedAt}
										className='text-xs text-muted-foreground'
									>
										{formatLongPtDate(
											review.storeRepliedAt
										)}
									</time>
								) : null}
							</div>
							<p className='mt-2 text-sm leading-relaxed text-foreground'>
								{review.storeReply}
							</p>
						</div>
					</div>
				</aside>
			) : (
				<div className='mt-5 flex items-start gap-3 rounded-xl bg-muted/40 px-3.5 py-3'>
					<MessageSquareText
						className='mt-0.5 size-4 shrink-0 text-muted-foreground'
						aria-hidden
					/>
					<p className='text-sm leading-relaxed text-muted-foreground'>
						A loja ainda não respondeu. Quando responder, a mensagem
						aparece aqui.
					</p>
				</div>
			)}
		</section>
	)
}
