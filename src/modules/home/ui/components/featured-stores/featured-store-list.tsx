import type { StoreProfile } from '@/types/marketplace'
import { StoreCircleCard } from './store-circle-card'

type FeaturedStoresListProps = {
	stores: StoreProfile[]
}

export const FeaturedStoresList = ({ stores }: FeaturedStoresListProps) => (
	<div className='scrollbar-hide flex gap-4 overflow-x-auto py-1 sm:gap-5'>
		{stores.map((store, index) => (
			<StoreCircleCard
				key={store.id}
				store={store}
				highlighted={index === 0}
			/>
		))}
	</div>
)
