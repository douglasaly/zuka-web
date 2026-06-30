import { ProductCard } from '@/components/explore-product-card'
import type { Product } from '@/types/marketplace'

type RelatedProductsProps = {
	products: Product[]
}

export const RelatedProducts = ({ products }: RelatedProductsProps) => {
	if (products.length === 0) return null

	return (
		<div className='space-y-4 pt-4'>
			<h2 className='font-heading text-lg font-bold'>
				Produtos relacionados
			</h2>
			<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
				{products.map((p) => (
					<ProductCard key={p.id} product={p} variant='compact' />
				))}
			</div>
		</div>
	)
}
