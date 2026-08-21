'use client'
import { ViewModeToggle } from '@/components/view-mode-toggle'
import { CategoryFilter } from '../components/category-filter'
import { ExploreProductsGrid } from '../components/explore-products-grid'
import { ExploreProductsSkeleton } from '../components/explore-products-skeleton'
import { ExploreResultsCount } from '../components/explore-result-count'
import type { CategoryOption, ViewMode } from '@/types'

interface Props {
	categorySlug: string
	categoryOptions: CategoryOption[]
	onCategoryChange: (slug: string) => void
	viewMode: ViewMode
	onViewModeChange: (mode: ViewMode) => void
	isLoading: boolean
	products: ReturnType<
		typeof import('../../hooks/use-explore').useExplore
	>['products']
	fetchNextPage: () => void
	hasNextPage: boolean
	isFetchingNextPage: boolean
}
export function ExploreProductsSection({
	categorySlug,
	categoryOptions,
	onCategoryChange,
	viewMode,
	onViewModeChange,
	isLoading,
	products,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
}: Props) {
	return (
		<>
			<CategoryFilter
				options={categoryOptions}
				value={categorySlug}
				onChange={onCategoryChange}
			/>

			<div className='flex items-center justify-between'>
				{!isLoading && (
					<ExploreResultsCount
						count={products.length}
						singular='produto'
						plural='produtos'
					/>
				)}
				<ViewModeToggle value={viewMode} onChange={onViewModeChange} />
			</div>

			{isLoading ? (
				<ExploreProductsSkeleton />
			) : (
				<ExploreProductsGrid
					products={products}
					viewMode={viewMode}
					fetchNextPage={fetchNextPage}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
				/>
			)}
		</>
	)
}
