'use client'

import { ChevronRight, SearchIcon, SlidersHorizontal, Tag } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { ExploreStoreCard } from '@/modules/explore/ui/components/explore-store-card'
import { useSearch } from '../../hooks/use-search'
import { SearchEmpty } from '../components/search-empty'
import {
	type FilterValues,
	SearchFiltersSheet,
} from '../components/search-filters-sheet'
import { SearchSkeleton } from '../components/search-skeleton'

export function SearchView() {
	const searchParams = useSearchParams()

	const q = searchParams.get('q') ?? ''
	const category = searchParams.get('categoria') ?? ''
	const province = searchParams.get('provincia') ?? ''
	const minPrice = searchParams.get('preco_min') ?? ''
	const maxPrice = searchParams.get('preco_max') ?? ''
	const isNew = searchParams.get('recente') ?? ''
	const sort = searchParams.get('ordenar') ?? 'relevance'

	const { data, isLoading } = useSearch({
		query: q,
		category,
		province,
		minPrice,
		maxPrice,
		isNew,
		sort,
	})

	const hasQuery = !!q
	const noDataYet = hasQuery && !data
	const showSkeleton = isLoading || noDataYet

	const hasResults =
		(data?.products?.length ?? 0) > 0 ||
		(data?.stores?.length ?? 0) > 0 ||
		(data?.categories?.length ?? 0) > 0

	const totalResults =
		(data?.products?.length ?? 0) +
		(data?.stores?.length ?? 0) +
		(data?.categories?.length ?? 0)

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
		window.history.pushState(null, '', `/pesquisa?${params.toString()}`)
	}

	const handleClearFilters = () => {
		const params = new URLSearchParams()
		if (q) params.set('q', q)
		window.history.pushState(null, '', `/pesquisa?${params.toString()}`)
	}

	const filterValues: FilterValues = {
		category,
		province,
		minPrice,
		maxPrice,
		isNew,
		sort,
	}

	return (
		<div className='mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8'>
			{/* Filter button (search input is in the navbar) */}
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

			{!showSkeleton && !q && (
				<div className='flex flex-col items-center justify-center gap-3 py-20'>
					<SearchIcon className='size-12 text-muted-foreground/40' />
					<p className='text-muted-foreground'>
						Digita algo para começar a pesquisar
					</p>
				</div>
			)}

			{!showSkeleton && q && !hasResults && <SearchEmpty query={q} />}

			{!showSkeleton && hasResults && (
				<div className='space-y-8'>
					{/* Result count */}
					<p className='text-sm text-muted-foreground'>
						{totalResults} resultado{totalResults !== 1 ? 's' : ''}{' '}
						para{' '}
						<span className='font-medium text-foreground'>
							"{q}"
						</span>
					</p>

					{/* Products */}
					{(data?.products?.length ?? 0) > 0 && (
						<section>
							<div className='mb-3 flex items-center justify-between'>
								<h2 className='text-lg font-semibold'>
									Produtos
								</h2>
								<Link
									href={`/feed/explorar?search=${encodeURIComponent(q)}`}
									className='flex items-center gap-1 text-sm text-secondary hover:underline'
								>
									Ver todos{' '}
									<ChevronRight className='size-3.5' />
								</Link>
							</div>
							<div className='grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6'>
								{data?.products.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
									/>
								))}
							</div>
						</section>
					)}

					{/* Stores */}
					{(data?.stores?.length ?? 0) > 0 && (
						<section>
							<div className='mb-3 flex items-center justify-between'>
								<h2 className='text-lg font-semibold'>Lojas</h2>
								<Link
									href={`/feed/explorar?tab=stores&search=${encodeURIComponent(q)}`}
									className='flex items-center gap-1 text-sm text-secondary hover:underline'
								>
									Ver todas{' '}
									<ChevronRight className='size-3.5' />
								</Link>
							</div>
							<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
								{data?.stores.map((store) => (
									<ExploreStoreCard
										key={store.id}
										store={store}
									/>
								))}
							</div>
						</section>
					)}

					{/* Categories */}
					{(data?.categories?.length ?? 0) > 0 && (
						<section>
							<div className='mb-3 flex items-center justify-between'>
								<h2 className='text-lg font-semibold'>
									Categorias
								</h2>
							</div>
							<div className='flex flex-wrap gap-2'>
								{data?.categories.map((cat) => (
									<Link
										key={cat.id}
										href={`/feed/explorar?categoria=${cat.slug}`}
									>
										<Button
											variant='outline'
											className='rounded-full'
											size='sm'
										>
											<Tag className='mr-1.5 size-3.5' />
											{cat.name}
										</Button>
									</Link>
								))}
							</div>
						</section>
					)}
				</div>
			)}
		</div>
	)
}
