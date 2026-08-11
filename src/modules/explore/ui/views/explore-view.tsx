'use client'

import { SegmentedControl } from '@/components/segmented-control'
import { TAB_OPTIONS, useExplore } from '../../hooks/use-explore'
import { ExploreSearchBar } from '../components/explore-search-bar'
import { ExploreProductsSection } from '../sections/explore-products-section'
import { ExploreStoresSection } from '../sections/explore-stores-section'

export const ExploreView = () => {
	const {
		tab,
		search,
		setSearch,
		viewMode,
		setViewMode,
		categorySlug,
		categoryOptions,
		filterValues,
		handleTabChange,
		handleCategoryChange,
		handleApplyFilters,
		handleClearFilters,
		products,
		productsQuery,
		stores,
		storesQuery,
	} = useExplore()

	return (
		<div className='mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8'>
			<div className='space-y-5'>
				<ExploreSearchBar
					value={search}
					onChange={setSearch}
					filterValues={filterValues}
					handleApplyFilters={handleApplyFilters}
					handleClearFilters={handleClearFilters}
				/>

				<SegmentedControl
					options={TAB_OPTIONS}
					value={tab}
					onChange={handleTabChange}
				/>

				{tab === 'products' && (
					<ExploreProductsSection
						categorySlug={categorySlug}
						categoryOptions={categoryOptions}
						onCategoryChange={handleCategoryChange}
						viewMode={viewMode}
						onViewModeChange={setViewMode}
						isLoading={productsQuery.isLoading}
						products={products}
						fetchNextPage={productsQuery.fetchNextPage}
						hasNextPage={productsQuery.hasNextPage ?? false}
						isFetchingNextPage={productsQuery.isFetchingNextPage}
					/>
				)}

				{tab === 'stores' && (
					<ExploreStoresSection
						isLoading={storesQuery.isLoading}
						stores={stores}
						fetchNextPage={storesQuery.fetchNextPage}
						hasNextPage={storesQuery.hasNextPage ?? false}
						isFetchingNextPage={storesQuery.isFetchingNextPage}
					/>
				)}
			</div>
		</div>
	)
}
