'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { FilterValues } from '../ui/components/search-filters-sheet'

export function useSearchFilters() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const q = searchParams.get('q') ?? ''
	const category = searchParams.get('categoria') ?? ''
	const province = searchParams.get('provincia') ?? ''
	const minPrice = searchParams.get('preco_min') ?? ''
	const maxPrice = searchParams.get('preco_max') ?? ''
	const isNew = searchParams.get('recente') ?? ''
	const sort = searchParams.get('ordenar') ?? 'relevance'

	const filterValues: FilterValues = {
		category,
		province,
		minPrice,
		maxPrice,
		isNew,
		sort,
	}

	const navigate = (params: URLSearchParams) => {
		const qs = params.toString()
		router.replace(qs ? `/pesquisa?${qs}` : '/pesquisa', { scroll: false })
	}

	const handleApplyFilters = (values: FilterValues) => {
		const params = new URLSearchParams()
		if (q) params.set('q', q)
		if (values.category && values.category !== 'all')
			params.set('categoria', values.category)
		if (values.province && values.province !== 'all')
			params.set('provincia', values.province)
		if (values.minPrice) params.set('preco_min', values.minPrice)
		if (values.maxPrice) params.set('preco_max', values.maxPrice)
		if (values.isNew === 'true') params.set('recente', 'true')
		if (values.sort && values.sort !== 'relevance')
			params.set('ordenar', values.sort)
		navigate(params)
	}

	const handleClearFilters = () => {
		const params = new URLSearchParams()
		if (q) params.set('q', q)
		navigate(params)
	}

	return {
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
	}
}
