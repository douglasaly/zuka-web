import { CategoriesSection } from '../sections/categories-section'

interface HomeViewProps {
	categoryId?: string
}

export const HomeView = ({ categoryId }: HomeViewProps) => {
	return (
		<div className='max-w-600 mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6'>
			{/* Featured store */}
			{/* Categories section */}
			{/* <CategoriesSection /> *Fix overflow */}
			{/* Featured stores avatar */}
			{/* News section */}
		</div>
	)
}
