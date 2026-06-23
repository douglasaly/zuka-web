import Image from 'next/image'
import { CategoriesSection } from '../sections/categories-section'
import { FeaturedStoresSection } from '../sections/featured-stores'
import ProductsSection from '../sections/products-section'

interface HomeViewProps {
	categoryId?: string
}

export const HomeView = ({ categoryId }: HomeViewProps) => {
	return (
		<div className='max-w-600 mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6 overflow-hidden'>
			{/* Featured store */}
			<div className='bg-gray-300 w-full h-50 rounded-4xl relatvie'></div>

			{/* Categories section */}
			<CategoriesSection categoryId={categoryId} />

			{/* Featured stores avatar section */}
			<FeaturedStoresSection />

			{/* New products section */}
			<ProductsSection />
		</div>
	)
}
