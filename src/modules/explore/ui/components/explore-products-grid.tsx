import { Package } from 'lucide-react'
import type { ViewMode } from '@/components/view-mode-toggle'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/modules/profile/ui/components/empty-state'
import type { Product } from '@/types/marketplace'
import { ExploreProductCard } from './explore-products-card'

type ExploreProductsGridProps = {
	products: Product[]
	viewMode: ViewMode
}

export const ExploreProductsGrid = ({
	products,
	viewMode,
}: ExploreProductsGridProps) => {
	if (products.length === 0) {
		return (
			<EmptyState
				icon={Package}
				title='Nenhum produto encontrado'
				description='Tente pesquisar por outro termo ou categoria'
			/>
		)
	}

	return (
		<div
			className={cn(
				viewMode === 'grid'
					? 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4'
					: 'flex flex-col gap-3'
			)}
		>
			{products.map((product) => (
				<ExploreProductCard
					key={product.id}
					product={product}
					variant={viewMode === 'list' ? 'compact' : 'default'}
				/>
			))}
		</div>
	)
}
