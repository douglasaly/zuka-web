'use client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2, PackageOpen } from 'lucide-react'
import { useMemo, useState } from 'react'
import { InfiniteScrollTrigger } from '@/components/infinite-scroll-trigger'
import { fetchProductsInfinite } from '@/lib/api/marketplace'
import { ProductsList } from '../components/products/product-list'
import { ProductsSectionSkeleton } from '../components/products/product-section-list'
import { ProductsSectionHeader } from '../components/products/products-section-header'
import type { ViewMode } from '@/types'

const HOME_PRODUCTS_PAGE_SIZE = 24
export const ProductsSection = () => {
	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const productsQuery = useInfiniteQuery({
		queryKey: ['home-products'],
		queryFn: ({ pageParam }) =>
			fetchProductsInfinite({
				pageParam,
				limit: HOME_PRODUCTS_PAGE_SIZE,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.pagination.hasMore
				? lastPage.pagination.nextCursor
				: undefined,
		initialPageParam: null as string | null,
	})
	const products = useMemo(
		() => productsQuery.data?.pages.flatMap((page) => page.data) ?? [],
		[productsQuery.data]
	)
	const isInitialLoading = productsQuery.isLoading && products.length === 0
	return (
		<section className='space-y-5'>
			<ProductsSectionHeader
				viewMode={viewMode}
				onViewModeChange={setViewMode}
			/>

			{isInitialLoading ? (
				<ProductsSectionSkeleton viewMode={viewMode} />
			) : products.length === 0 ? (
				<div className='flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 px-4 py-12 text-center'>
					<div className='flex size-12 items-center justify-center rounded-full bg-muted'>
						<PackageOpen className='size-6 text-muted-foreground' />
					</div>
					<p className='text-sm text-muted-foreground'>
						Ainda não há produtos disponíveis.
					</p>
				</div>
			) : (
				<>
					<ProductsList products={products} viewMode={viewMode} />

					{productsQuery.isFetchingNextPage && (
						<div className='flex justify-center py-4'>
							<Loader2 className='size-5 animate-spin text-muted-foreground' />
						</div>
					)}

					<InfiniteScrollTrigger
						hasMore={Boolean(productsQuery.hasNextPage)}
						isLoading={productsQuery.isFetchingNextPage}
						onLoadMore={() => {
							void productsQuery.fetchNextPage()
						}}
					/>
				</>
			)}
		</section>
	)
}
