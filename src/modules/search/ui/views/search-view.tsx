'use client'
import { SearchIcon, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearch } from '../../hooks/use-search'
import { useSearchFilters } from '../../hooks/use-search-filters'
import { SearchEmpty } from '../components/search-empty'
import { SearchFiltersSheet } from '../components/search-filters-sheet'
import { SearchSkeleton } from '../components/search-skeleton'
import { SearchResultsSection } from '../sections/search-results-section'
export function SearchView() {
	const {
		q,
		category,
		province,
		minPrice,
		maxPrice,
		isNew,
		sort,
		filterValues,
		handleApplyFilters,
		handleClearFilters,
	} = useSearchFilters()
	const { data, isSearching } = useSearch({
		query: q,
		category,
		province,
		minPrice,
		maxPrice,
		isNew,
		sort,
	})
	const hasQuery = !!q.trim()
	const hasFilters = Boolean(
		(category && category !== 'all') ||
			(province && province !== 'all') ||
			minPrice ||
			maxPrice ||
			isNew === 'true'
	)
	const hasSearchIntent = hasQuery || hasFilters
	const showSkeleton = hasSearchIntent && isSearching
	const hasResults =
		(data?.products?.length ?? 0) > 0 ||
		(data?.stores?.length ?? 0) > 0 ||
		(data?.categories?.length ?? 0) > 0
	const totalResults =
		(data?.products?.length ?? 0) +
		(data?.stores?.length ?? 0) +
		(data?.categories?.length ?? 0)
	const resultLabel = hasQuery ? (
		<>
			{totalResults} resultado{totalResults !== 1 ? 's' : ''} para{' '}
			<span className='font-medium text-foreground'>"{q}"</span>
		</>
	) : (
		<>
			{totalResults} resultado{totalResults !== 1 ? 's' : ''}
		</>
	)
	return (
		<div className='mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8'>
			<div className='mb-6 flex items-center justify-end'>
				<SearchFiltersSheet
					values={filterValues}
					onApply={handleApplyFilters}
					onClear={handleClearFilters}
					trigger={
						<Button
							variant='outline'
							size='icon'
							className='size-10 rounded-xl'
							aria-label='Filtros'
						>
							<SlidersHorizontal className='size-4' />
						</Button>
					}
				/>
			</div>

			{showSkeleton && <SearchSkeleton />}

			{!showSkeleton && !hasSearchIntent && (
				<div className='flex flex-col items-center justify-center gap-3 py-20'>
					<SearchIcon className='size-12 text-muted-foreground/40' />
					<p className='text-muted-foreground'>
						Digita algo para começar a pesquisar
					</p>
				</div>
			)}

			{!showSkeleton && hasSearchIntent && !hasResults && (
				<SearchEmpty query={q || 'estes filtros'} />
			)}

			{!showSkeleton && hasResults && data && (
				<SearchResultsSection
					data={data}
					q={q}
					category={category}
					resultLabel={resultLabel}
				/>
			)}
		</div>
	)
}
