import { ProductCard } from '@/components/explore-product-card'
import type { Product } from '@/types/marketplace'

type StoreProductsGridProps = {
	products: Product[]
}

export const StoreProductsGrid = ({ products }: StoreProductsGridProps) => {
	if (products.length === 0) {
		return (
			<p className='col-span-2 py-8 text-center text-sm text-muted-foreground'>
				Esta loja ainda não tem produtos.
			</p>
		)
	}

	return (
		<div className='grid grid-cols-2 gap-3 sm:gap-4'>
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	)
}
