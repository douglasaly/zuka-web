import { ProductCard } from '@/components/product-card'
import { cn } from '@/lib/utils'
import type { Product, ViewMode } from '@/types'

type ProductsListProps = {
	products: Product[]
	viewMode: ViewMode
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
				product={p}
				variant={viewMode === 'list' ? 'compact' : 'default'}
				showFavorite
			/>
		))}
	</div>
)
