'use client'

import { useQuery } from '@tanstack/react-query'
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
				<p className='text-sm text-muted-foreground'>
					Ainda não há produtos disponíveis.
				</p>
			) : (
				<ProductsList products={products} viewMode={viewMode} />
			)}
		</section>
	)
}
