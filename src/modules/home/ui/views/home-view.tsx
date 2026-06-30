import { CategoriesSection } from '../sections/categories-section'
import { FeaturedStoresSection } from '../sections/featured-stores'
import { HomeHeroSection } from '../sections/home-hero-section'
import { ProductsSection } from '../sections/products-section'

interface HomeViewProps {
	categoryId?: string
}

export const HomeView = ({ categoryId }: HomeViewProps) => {
	return (
		<div className='mx-auto flex max-w-7xl flex-col gap-10 px-4 py-6 md:px-6 md:py-8'>
			<HomeHeroSection />
			<CategoriesSection categoryId={categoryId} />
			<FeaturedStoresSection />
			<ProductsSection />
		</div>
	)
}
