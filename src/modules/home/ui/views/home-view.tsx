import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { CategoriesSection } from '../sections/categories-section'

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
			{/* Featured stores avatar */}
			<div className='flex flex-col w-full space-y-3'>
				<div className='flex justify-between items-center'>
					<h1 className='font-semibold text-xl'>Lojas em Destaque</h1>
					<Link href='/stores'>
						<div className='flex items-center justify-center gap-2 hover:underline text-sm'>
							Ver todas
							<ArrowRight className='size-4 mr-2' />
						</div>
					</Link>
				</div>
				<div>Avatars</div>
			</div>
			{/* News section */}
		</div>
	)
}
