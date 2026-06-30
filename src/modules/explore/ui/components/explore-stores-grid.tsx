import { Store } from 'lucide-react'
import { EmptyState } from '@/modules/profile/ui/components/empty-state'
import type { StoreProfile } from '@/types/marketplace'
import { ExploreStoreCard } from './explore-store-card'

type ExploreStoresGridProps = {
	stores: StoreProfile[]
}

export const ExploreStoresGrid = ({ stores }: ExploreStoresGridProps) => {
	if (stores.length === 0) {
		return (
			<EmptyState
				icon={Store}
				title='Nenhuma loja encontrada'
				description='Tente pesquisar por outro nome ou localização'
			/>
		)
	}

	return (
		<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
			{stores.map((store) => (
				<ExploreStoreCard key={store.id} store={store} />
			))}
		</div>
	)
}
