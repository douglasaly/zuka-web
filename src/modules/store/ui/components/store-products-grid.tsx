import { PackageOpen } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/types'

type StoreProductsGridProps = {
	products: Product[]
}
export const StoreProductsGrid = ({ products }: StoreProductsGridProps) => {
	if (products.length === 0) {
		return (
			<div className='flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 px-4 py-12 text-center'>
				<div className='flex size-12 items-center justify-center rounded-full bg-muted'>
					<PackageOpen className='size-6 text-muted-foreground' />
				</div>
				<p className='text-sm text-muted-foreground'>
					Esta loja ainda não tem produtos.
				</p>
			</div>
		)
	}
	return (
		<div className='grid grid-cols-2 gap-3 sm:gap-4'>
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={product}
					showStore={false}
				/>
			))}
		</div>
	)
}
