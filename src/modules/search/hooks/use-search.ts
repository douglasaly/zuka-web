'use client'

import { useQuery } from '@tanstack/react-query'
import type { SearchResults } from '@/app/api/search/route'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

type UseSearchProps = {
	query: string
	category?: string
	province?: string
	minPrice?: string
	maxPrice?: string
	isNew?: string
	sort?: string
}

async function fetchSearch(params: URLSearchParams): Promise<SearchResults> {
	const res = await fetch(`/api/search?${params.toString()}`)
	if (!res.ok) throw new Error('Falha ao pesquisar')
	return res.json()
}

function hasActiveFilters({
	category,
	province,
	minPrice,
	maxPrice,
	isNew,
}: Omit<UseSearchProps, 'query' | 'sort'>) {
	return Boolean(
		(category && category !== 'all') ||
			(province && province !== 'all') ||
			minPrice ||
			maxPrice ||
			isNew === 'true'
	)
}

export const useSearch = ({
	query,
	category,
	province,
	minPrice,
	maxPrice,
	isNew,
	sort,
}: UseSearchProps) => {
	const debouncedQuery = useDebouncedValue(query, 350)
	const isDebouncing = query.trim() !== debouncedQuery.trim()
	const filtersActive = hasActiveFilters({
		category,
		province,
		minPrice,
		maxPrice,
		isNew,
	})

	const params = new URLSearchParams()
	if (debouncedQuery) params.set('q', debouncedQuery)
	if (category && category !== 'all') params.set('categoria', category)
	if (province && province !== 'all') params.set('provincia', province)
	if (minPrice) params.set('preco_min', minPrice)
	if (maxPrice) params.set('preco_max', maxPrice)
	if (isNew === 'true') params.set('recente', 'true')
	if (sort && sort !== 'relevance') params.set('ordenar', sort)

	const enabled = debouncedQuery.length > 0 || filtersActive

	const result = useQuery({
		queryKey: [
			'search',
			debouncedQuery,
			category,
			province,
			minPrice,
			maxPrice,
			isNew,
			sort,
		],
		queryFn: () => fetchSearch(params),
		enabled,
	})

	return {
		...result,
		/** True while the query is debouncing or a fetch is in flight. */
		isSearching: enabled && (isDebouncing || result.isFetching),
	}
}
