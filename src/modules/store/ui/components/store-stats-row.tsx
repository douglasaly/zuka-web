import { Star } from 'lucide-react'
import type { StoreProfile } from '@/types/marketplace'

type StoreStatsRowProps = {
	store: StoreProfile
}

export const StoreStatsRow = ({ store }: StoreStatsRowProps) => (
	<div className='mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground'>
		<span className='flex items-center gap-1'>
			<Star className='size-3.5 fill-amber-400 text-amber-400' />
			<span className='font-medium text-foreground'>{store.rating}</span>(
			{store.reviewCount})
		</span>
		<span>{store.followers.toLocaleString('pt-PT')} seguidores</span>
		<span>
			{store.productCount} produto{store.productCount !== 1 ? 's' : ''}
		</span>
	</div>
)
