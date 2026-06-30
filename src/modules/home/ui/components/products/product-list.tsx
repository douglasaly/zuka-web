import { ProductCard } from '@/components/product-card'
import { toProductCard } from '@/lib/api/marketplace'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/marketplace'
import type { ProductsViewMode } from './products-section-header'

type ProductsListProps = {
	products: Product[]
	viewMode: ProductsViewMode
}

export const ProductsList = ({ products, viewMode }: ProductsListProps) => (
	<div
		className={cn(
			viewMode === 'grid'
				? 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4'
				: 'flex flex-col gap-3'
		)}
	>
		{products.map((p) => (
			<ProductCard
				key={p.id}
				product={toProductCard(p)}
				variant={viewMode === 'list' ? 'horizontal' : 'default'}
			/>
		))}
	</div>
)
