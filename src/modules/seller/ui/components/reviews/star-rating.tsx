'use client'
import { Star, StarHalf } from 'lucide-react'
import { cn } from '@/lib/utils'

type StarRatingProps = {
	rating: number
	size?: 'sm' | 'md'
	className?: string
}
export function StarRating({
	rating,
	size = 'sm',
	className,
}: StarRatingProps) {
	const iconClass = size === 'md' ? 'size-4' : 'size-3.5'
	return (
		<div
			className={cn('flex gap-0.5', className)}
			aria-label={`${rating.toFixed(1)} de 5 estrelas`}
		>
			{[1, 2, 3, 4, 5].map((star) => {
				const filled = rating >= star
				const half = !filled && rating >= star - 0.5
				return (
					<span
						key={star}
						className={
							filled || half
								? 'text-amber-500'
								: 'text-muted-foreground/35'
						}
						aria-hidden
					>
						{half ? (
							<StarHalf
								className={cn(iconClass, 'fill-current')}
							/>
						) : (
							<Star
								className={cn(
									iconClass,
									filled && 'fill-current'
								)}
							/>
						)}
					</span>
				)
			})}
		</div>
	)
}
