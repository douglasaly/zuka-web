'use client'

import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import type { SearchResults } from '@/app/api/search/route'

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

	const params = new URLSearchParams()
	if (debouncedQuery) params.set('q', debouncedQuery)
	if (category) params.set('categoria', category)
	if (province) params.set('provincia', province)
	if (minPrice) params.set('preco_min', minPrice)
	if (maxPrice) params.set('preco_max', maxPrice)
	if (isNew === 'true') params.set('recente', 'true')
	if (sort && sort !== 'relevance') params.set('ordenar', sort)

	return useQuery({
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
		enabled: debouncedQuery.length > 0,
		placeholderData: (prev) => prev,
	})
}
