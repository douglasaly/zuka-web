'use client'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { ViewMode } from '@/components/view-mode-toggle'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { getCategories } from '@/lib/api/categories'
import {
	fetchProductsInfinite,
	fetchStoresInfinite,
} from '@/lib/api/marketplace'
import type { FilterValues } from '@/modules/search/ui/components/search-filters-sheet'
import type { CategoryOption } from '../ui/components/category-filter'

interface Category {
	id: string
	name: string
	slug: string
}
export const TAB_OPTIONS = [
	{ value: 'products', label: 'Produtos' },
	{ value: 'stores', label: 'Lojas' },
]
export function useExplore() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const tab = searchParams.get('tab') === 'stores' ? 'stores' : 'products'
	const categorySlug = searchParams.get('categoria') || 'all'
	const province = searchParams.get('provincia') ?? ''
	const minPrice = searchParams.get('preco_min') ?? ''
	const maxPrice = searchParams.get('preco_max') ?? ''
	const isNew = searchParams.get('recente') ?? ''
	const sort = searchParams.get('ordenar') ?? 'relevance'
	const searchFromUrl =
		searchParams.get('q') ?? searchParams.get('search') ?? ''
	const [search, setSearch] = useState(searchFromUrl)
	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const debouncedSearch = useDebouncedValue(search, 350)
	useEffect(() => {
		setSearch(searchFromUrl)
	}, [searchFromUrl])
	const updateParams = (updates: Record<string, string | null>) => {
		const params = new URLSearchParams(searchParams.toString())
		for (const [key, value] of Object.entries(updates)) {
			if (value === null) {
				params.delete(key)
			} else {
				params.set(key, value)
			}
		}
		const query = params.toString()
		router.push(query ? `${pathname}?${query}` : pathname, {
			scroll: false,
		})
	}
	const handleTabChange = (value: string) => {
		updateParams({ tab: value === 'products' ? null : value })
	}
	const handleCategoryChange = (slug: string) => {
		updateParams({ categoria: slug === 'all' ? null : slug })
	}
	const handleApplyFilters = (values: FilterValues) => {
		const params = new URLSearchParams()
		if (values.category && values.category !== 'all')
			params.set('categoria', values.category)
		if (values.province && values.province !== 'all')
			params.set('provincia', values.province)
		if (values.minPrice) params.set('preco_min', values.minPrice)
		if (values.maxPrice) params.set('preco_max', values.maxPrice)
		if (values.isNew === 'true') params.set('recente', 'true')
		if (values.sort && values.sort !== 'relevance')
			params.set('ordenar', values.sort)
		if (search) params.set('q', search)
		const query = params.toString()
		router.push(`/pesquisa${query ? `?${query}` : ''}`, {
			scroll: false,
		})
	}
	const handleClearFilters = () => {
		const params = new URLSearchParams()
		if (search) params.set('q', search)
		const query = params.toString()
		router.push(`/pesquisa${query ? `?${query}` : ''}`, {
			scroll: false,
		})
	}
	const { data: categories = [] } = useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: getCategories,
	})
	const productsQuery = useInfiniteQuery({
		queryKey: [
			'explore-products',
			categorySlug,
			debouncedSearch,
			province,
			minPrice,
			maxPrice,
			isNew,
			sort,
		],
		queryFn: ({ pageParam }) =>
			fetchProductsInfinite({
				pageParam,
				category: categorySlug === 'all' ? undefined : categorySlug,
				search: debouncedSearch || undefined,
				province: province || undefined,
				minPrice: minPrice || undefined,
				maxPrice: maxPrice || undefined,
				isNew: isNew || undefined,
				sort: sort === 'relevance' ? undefined : sort || undefined,
				limit: 50,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.pagination.hasMore
				? lastPage.pagination.nextCursor
				: undefined,
		initialPageParam: null as string | null,
		enabled: tab === 'products',
	})
	const products = useMemo(
		() => productsQuery.data?.pages.flatMap((p) => p.data) ?? [],
		[productsQuery.data]
	)
	const storesQuery = useInfiniteQuery({
		queryKey: ['explore-stores', debouncedSearch],
		queryFn: ({ pageParam }) =>
			fetchStoresInfinite({
				pageParam,
				search: debouncedSearch || undefined,
				limit: 30,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.pagination.hasMore
				? lastPage.pagination.nextCursor
				: undefined,
		initialPageParam: null as string | null,
		enabled: tab === 'stores',
	})
	const stores = useMemo(
		() => storesQuery.data?.pages.flatMap((p) => p.data) ?? [],
		[storesQuery.data]
	)
	const categoryOptions = useMemo<CategoryOption[]>(
		() => [
			{ value: 'all', label: 'Todos' },
			...categories.map((c) => ({ value: c.slug, label: c.name })),
		],
		[categories]
	)
	const filterValues: FilterValues = {
		category: categorySlug,
		province,
		minPrice,
		maxPrice,
		isNew,
		sort,
	}
	return {
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
	}
}
