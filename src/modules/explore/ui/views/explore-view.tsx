'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { SegmentedControl } from '@/components/segmented-control'
import { type ViewMode, ViewModeToggle } from '@/components/view-mode-toggle'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
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
}

const TAB_OPTIONS = [
	{ value: 'products', label: 'Produtos' },
	{ value: 'stores', label: 'Lojas' },
]

export const ExploreView = () => {
	const searchParams = useSearchParams()
	const initialTab =
		searchParams.get('tab') === 'stores' ? 'stores' : 'products'

	const [tab, setTab] = useState(initialTab)
	const [category, setCategory] = useState('all')
	const [search, setSearch] = useState('')
	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const debouncedSearch = useDebouncedValue(search, 350)

	useEffect(() => {
		const tabParam = searchParams.get('tab')
		if (tabParam === 'stores' || tabParam === 'products') {
			setTab(tabParam)
		}
	}, [searchParams])

	const { data: categories = [] } = useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await fetch('/api/categories')
			if (!res.ok) throw new Error('Failed to load categories')
			return res.json()
		},
	})

	const { data: products = [], isLoading: productsLoading } = useQuery({
		queryKey: ['explore-products', category, debouncedSearch],
		queryFn: () =>
			fetchProducts({
				category: category === 'all' ? undefined : category,
				search: debouncedSearch || undefined,
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
			...categories.map((c) => ({ value: c.id, label: c.name })),
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
					onChange={setTab}
				/>

				{tab === 'products' && (
					<>
						<CategoryFilter
							options={categoryOptions}
							value={category}
							onChange={setCategory}
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
