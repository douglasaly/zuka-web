'use client'

import { ChevronRight, SearchIcon, SlidersHorizontal, Tag } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
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
	const router = useRouter()
	const searchParams = useSearchParams()

	const q = searchParams.get('q') ?? ''
	const category = searchParams.get('categoria') ?? ''
	const province = searchParams.get('provincia') ?? ''
	const minPrice = searchParams.get('preco_min') ?? ''
	const maxPrice = searchParams.get('preco_max') ?? ''
	const isNew = searchParams.get('recente') ?? ''
	const sort = searchParams.get('ordenar') ?? 'relevance'

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

	const filterValues: FilterValues = {
		category,
		province,
		minPrice,
		maxPrice,
		isNew,
		sort,
	}

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

			{!showSkeleton && hasResults && (
				<div className='space-y-8'>
					<p className='text-sm text-muted-foreground'>{resultLabel}</p>

					{(data?.products?.length ?? 0) > 0 && (
						<section>
							<div className='mb-3 flex items-center justify-between'>
								<h2 className='text-lg font-semibold'>
									Produtos
								</h2>
								<Link
									href={
										q
											? `/feed/explorar?q=${encodeURIComponent(q)}${category ? `&categoria=${encodeURIComponent(category)}` : ''}`
											: `/feed/explorar${category ? `?categoria=${encodeURIComponent(category)}` : ''}`
									}
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

					{(data?.stores?.length ?? 0) > 0 && (
						<section>
							<div className='mb-3 flex items-center justify-between'>
								<h2 className='text-lg font-semibold'>Lojas</h2>
								<Link
									href={`/feed/explorar?tab=stores&q=${encodeURIComponent(q)}`}
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
