'use client'

import { ExploreResultsCount } from '../components/explore-result-count'
import { ExploreStoresGrid } from '../components/explore-stores-grid'
import { ExploreStoresSkeleton } from '../components/explore-stores-skeleton'

interface Props {
	isLoading: boolean
	stores: ReturnType<
		typeof import('../../hooks/use-explore').useExplore
	>['stores']
	fetchNextPage: () => void
	hasNextPage: boolean
	isFetchingNextPage: boolean
}

export function ExploreStoresSection({
	isLoading,
	stores,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
}: Props) {
	return (
		<>
			{!isLoading && (
				<ExploreResultsCount
					count={stores.length}
					singular='loja'
					plural='lojas'
				/>
			)}

			{isLoading ? (
				<ExploreStoresSkeleton />
			) : (
				<ExploreStoresGrid
					stores={stores}
					fetchNextPage={fetchNextPage}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
				/>
			)}
		</>
	)
}
