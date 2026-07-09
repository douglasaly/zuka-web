'use client'

import { useQuery } from '@tanstack/react-query'
import { PackageOpen } from 'lucide-react'
import { useState } from 'react'
import { fetchProducts } from '@/lib/api/marketplace'
import { ProductsList } from '../components/products/product-list'
import { ProductsSectionSkeleton } from '../components/products/product-section-list'
import {
	ProductsSectionHeader,
	type ProductsViewMode,
} from '../components/products/products-section-header'

export const ProductsSection = () => {
	const [viewMode, setViewMode] = useState<ProductsViewMode>('grid')

	const { data: products = [], isLoading } = useQuery({
		queryKey: ['home-products'],
		queryFn: () => fetchProducts({ limit: 8 }),
	})

	return (
		<section className='space-y-5'>
			<ProductsSectionHeader
				viewMode={viewMode}
				onViewModeChange={setViewMode}
			/>

			{isLoading ? (
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
				<ProductsList products={products} viewMode={viewMode} />
			)}
		</section>
	)
}
