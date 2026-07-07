'use client'

import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { SegmentedControl } from '@/components/segmented-control'
import { type ViewMode, ViewModeToggle } from '@/components/view-mode-toggle'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { getCategories } from '@/lib/api/categories'
import { fetchProducts, fetchStores } from '@/lib/api/marketplace'
import {
	type FilterValues
} from '@/modules/search/ui/components/search-filters-sheet'
import {
	CategoryFilter,
	type CategoryOption,
} from '../components/category-filter'
import { ExploreProductsGrid } from '../components/explore-products-grid'
import { ExploreProductsSkeleton } from '../components/explore-products-skeleton'
import { ExploreResultsCount } from '../components/explore-result-count'
import { ExploreSearchBar } from '../components/explore-search-bar'
import { ExploreStoresGrid } from '../components/explore-stores-grid'
import { ExploreStoresSkeleton } from '../components/explore-stores-skeleton'

interface Category {
	id: string
	name: string
	slug: string
}

const TAB_OPTIONS = [
	{ value: 'products', label: 'Produtos' },
	{ value: 'stores', label: 'Lojas' },
]

export const ExploreView = () => {
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

	const [search, setSearch] = useState('')
	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const debouncedSearch = useDebouncedValue(search, 350)

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

	const { data: products = [], isLoading: productsLoading } = useQuery({
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
		queryFn: () =>
			fetchProducts({
				category: categorySlug === 'all' ? undefined : categorySlug,
				search: debouncedSearch || undefined,
				province: province || undefined,
				minPrice: minPrice || undefined,
				maxPrice: maxPrice || undefined,
				isNew: isNew || undefined,
				sort: sort || undefined,
				limit: 50,
			}),
		enabled: tab === 'products',
	})

	const { data: stores = [], isLoading: storesLoading } = useQuery({
		queryKey: ['explore-stores', debouncedSearch],
		queryFn: () => fetchStores({ search: debouncedSearch || undefined }),
		enabled: tab === 'stores',
	})

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
					<>
						<CategoryFilter
							options={categoryOptions}
							value={categorySlug}
							onChange={handleCategoryChange}
						/>

						<div className='flex items-center justify-between'>
							{!productsLoading && (
								<ExploreResultsCount
									count={products.length}
									singular='produto'
									plural='produtos'
								/>
							)}
							<ViewModeToggle
								value={viewMode}
								onChange={setViewMode}
							/>
						</div>

						{productsLoading ? (
							<ExploreProductsSkeleton />
						) : (
							<ExploreProductsGrid
								products={products}
								viewMode={viewMode}
							/>
						)}
					</>
				)}

				{tab === 'stores' && (
					<>
						{!storesLoading && (
							<ExploreResultsCount
								count={stores.length}
								singular='loja'
								plural='lojas'
							/>
						)}

						{storesLoading ? (
							<ExploreStoresSkeleton />
						) : (
							<ExploreStoresGrid stores={stores} />
						)}
					</>
				)}
			</div>
		</div>
	)
}
