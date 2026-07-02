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
	const categorySlug = searchParams.get('categoria') ?? 'all'

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

	const { data: categories = [] } = useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: getCategories,
	})

	const categoryId = useMemo(() => {
		if (categorySlug === 'all') return undefined
		return categories.find((c) => c.slug === categorySlug)?.id
	}, [categories, categorySlug])

	const { data: products = [], isLoading: productsLoading } = useQuery({
		queryKey: ['explore-products', categoryId, debouncedSearch],
		queryFn: () =>
			fetchProducts({
				category: categoryId,
				search: debouncedSearch || undefined,
				limit: 50,
			}),
		enabled:
			tab === 'products' &&
			(categorySlug === 'all' || (categories.length > 0 && !!categoryId)),
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

	const handleFilter = () => {
		// TODO: abrir sheet/modal de filtros avançados
	}

	return (
		<div className='mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8'>
			<div className='space-y-5'>
				<ExploreSearchBar
					value={search}
					onChange={setSearch}
					onFilter={handleFilter}
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
