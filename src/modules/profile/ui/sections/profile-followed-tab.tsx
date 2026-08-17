import { Store } from 'lucide-react'
import { EmptyState } from '../components/empty-state'
import {
	type FollowedStore,
	FollowedStoreCard,
} from '../components/followed-store-card'
import { FollowedStoreCardSkeleton } from '../components/followed-store-card-skeleton'

type ProfileFollowedTabProps = {
	stores: FollowedStore[]
	rawCount: number
	isLoading: boolean
}
export function ProfileFollowedTab({
	stores,
	rawCount,
	isLoading,
}: ProfileFollowedTabProps) {
	return (
		<div className='flex flex-col gap-3'>
			{isLoading ? (
				<div className='space-y-3'>
					{Array.from({ length: 3 }).map((_, index) => (
						<FollowedStoreCardSkeleton key={index} />
					))}
				</div>
			) : rawCount === 0 ? (
				<EmptyState
					icon={Store}
					title='Ainda não segue nenhuma loja'
					description='Siga lojas para ver as novidades delas aqui'
				/>
			) : (
				stores.map((store) => (
					<FollowedStoreCard key={store.id} store={store} />
				))
			)}
		</div>
	)
}
