'use client'

import { useQuery } from '@tanstack/react-query'
import { MessageSquare, Star, StarHalf } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

type Review = {
	id: string
	userName: string
	productName: string
	rating: number
	comment: string | null
	createdAt: string
	storeReply: string | null
}

const MOCK_REVIEWS: Review[] = [
	{
		id: '1',
		userName: 'Maria Silva',
		productName: 'Kit Cuidado Cabelo Natural',
		rating: 5,
		comment: 'Produto excelente! O cabelo ficou muito macio.',
		createdAt: '2026-07-05T10:30:00Z',
		storeReply: null,
	},
	{
		id: '2',
		userName: 'João Tembe',
		productName: 'Perfume Africana Femme 50ml',
		rating: 4,
		comment: 'Cheiro muito bom, mas a fixação podia ser melhor.',
		createdAt: '2026-07-01T14:00:00Z',
		storeReply: 'Obrigado pelo feedback! Vamos melhorar.',
	},
	{
		id: '3',
		userName: 'Ana Macamo',
		productName: 'Kit Cuidado Cabelo Natural',
		rating: 3,
		comment: 'Produto razoável, esperava mais.',
		createdAt: '2026-06-28T09:15:00Z',
		storeReply: null,
	},
]

function StarRating({ rating }: { rating: number }) {
	return (
		<div className='flex gap-0.5'>
			{[1, 2, 3, 4, 5].map((star) => {
				const filled = rating >= star
				const half = !filled && rating >= star - 0.5
				return (
					<span
						key={star}
						className={
							filled || half
								? 'text-amber-400'
								: 'text-muted-foreground/30'
						}
					>
						{half ? (
							<StarHalf className='size-3.5 fill-current' />
						) : (
							<Star
								className={`size-3.5 ${filled ? 'fill-current' : ''}`}
							/>
						)}
					</span>
				)
			})}
		</div>
	)
}

export const SellerReviewsView = () => {
	const { data, isLoading } = useQuery<Review[]>({
		queryKey: ['seller-reviews'],
		queryFn: async () => {
			// TODO: conectar à API real quando disponível
			const res = await fetch('/api/seller/reviews')
			if (!res.ok) return MOCK_REVIEWS
			const json = await res.json()
			return json.reviews as Review[]
		},
		staleTime: Number.POSITIVE_INFINITY,
	})

	if (isLoading) {
		return (
			<div className='space-y-3'>
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className='rounded-xl border border-border/60 bg-card p-5'
					>
						<Skeleton className='mb-2 h-4 w-32' />
						<Skeleton className='mb-3 h-3 w-48' />
						<Skeleton className='h-10 w-full' />
					</div>
				))}
			</div>
		)
	}

	const reviews = data ?? []

	if (reviews.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-24 text-center'>
				<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
					<Star className='size-8 text-muted-foreground' />
				</div>
				<h2 className='mt-4 font-heading text-xl font-bold'>
					Nenhuma avaliação ainda
				</h2>
				<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
					As avaliações dos clientes aparecerão aqui.
				</p>
			</div>
		)
	}

	const average =
		reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

	const distribution = [0, 0, 0, 0, 0]
	for (const r of reviews) {
		if (r.rating >= 1 && r.rating <= 5) {
			distribution[Math.floor(r.rating) - 1]++
		}
	}
	const maxCount = Math.max(...distribution, 1)

	return (
		<div className='space-y-6'>
			<div className='flex items-start justify-between'>
				<div>
					<h1 className='font-heading text-xl font-bold'>
						Avaliações
					</h1>
					<p className='text-sm text-muted-foreground'>
						{reviews.length}{' '}
						{reviews.length === 1 ? 'avaliação' : 'avaliações'}
					</p>
				</div>

				<div className='flex items-center gap-3 rounded-xl border border-border/60 bg-card px-5 py-3'>
					<span className='font-heading text-3xl font-bold'>
						{average.toFixed(1)}
					</span>
					<div className='space-y-0.5'>
						<StarRating rating={average} />
						<p className='text-xs text-muted-foreground'>
							média geral
						</p>
					</div>
				</div>
			</div>

			{/* Distribution bars */}
			<div className='rounded-xl border border-border/60 bg-card p-5'>
				<p className='mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
					Distribuição
				</p>
				<div className='space-y-1.5'>
					{[...distribution].reverse().map((count, i) => {
						const stars = 5 - i
						return (
							<div
								key={stars}
								className='flex items-center gap-2 text-sm'
							>
								<span className='w-4 text-right text-muted-foreground'>
									{stars}
								</span>
								<Star className='size-3 text-amber-400' />
								<div className='flex-1 h-2 rounded-full bg-muted overflow-hidden'>
									<div
										className='h-full rounded-full bg-amber-400 transition-all'
										style={{
											width: `${(count / maxCount) * 100}%`,
										}}
									/>
								</div>
								<span className='w-6 text-right text-xs text-muted-foreground'>
									{count}
								</span>
							</div>
						)
					})}
				</div>
			</div>

			{/* Review list */}
			<div className='space-y-2'>
				{reviews.map((review) => (
					<div
						key={review.id}
						className='rounded-xl border border-border/60 bg-card p-5'
					>
						<div className='flex items-start justify-between'>
							<div>
								<div className='flex items-center gap-2'>
									<div className='flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary'>
										{review.userName
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</div>
									<div>
										<p className='text-sm font-medium'>
											{review.userName}
										</p>
										<p className='text-xs text-muted-foreground'>
											{review.productName}
										</p>
									</div>
								</div>
							</div>
							<div className='text-right'>
								<StarRating rating={review.rating} />
								<p className='mt-0.5 text-xs text-muted-foreground'>
									{new Date(
										review.createdAt
									).toLocaleDateString('pt-PT')}
								</p>
							</div>
						</div>

						{review.comment && (
							<p className='mt-3 text-sm text-muted-foreground'>
								{review.comment}
							</p>
						)}

						{review.storeReply ? (
							<div className='mt-3 rounded-lg bg-muted/50 p-3'>
								<div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
									<MessageSquare className='size-3' />
									<span>Resposta da loja</span>
								</div>
								<p className='mt-1 text-sm'>
									{review.storeReply}
								</p>
							</div>
						) : (
							<button
								type='button'
								className='mt-3 text-xs font-medium text-primary hover:underline'
							>
								Responder
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
