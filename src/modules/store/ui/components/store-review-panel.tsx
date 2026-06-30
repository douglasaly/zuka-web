import { Star } from 'lucide-react'

type StoreReviewsPanelProps = {
	rating: number
	reviewCount: number
}

export const StoreReviewsPanel = ({
	rating,
	reviewCount,
}: StoreReviewsPanelProps) => (
	<div className='rounded-2xl border border-border/60 bg-card p-8 text-center'>
		<div className='mx-auto mb-2 flex items-center justify-center gap-1'>
			<Star className='size-5 fill-amber-400 text-amber-400' />
			<span className='text-2xl font-bold'>{rating}</span>
		</div>
		<p className='text-sm text-muted-foreground'>
			{reviewCount} avaliações de clientes
		</p>
	</div>
)
