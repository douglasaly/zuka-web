import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
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
			<div className='relative w-full h-60 overflow-hidden rounded-3xl bg-gray-300'>
				<Image
					src='/featured-placeholder.jpg'
					alt='featured'
					fill
					sizes='100vw'
					className='object-cover scale-105'
					loading='eager'
				/>

				<div className='absolute top-5 left-5 '>
					<h2 className='text-2xl font-semibold text-white'>
						Semana a moda
					</h2>
					<p className='text-white font-medium text-sm'>
						Até 40% desconto em capulanas
					</p>
				</div>

				<div className='absolute bottom-5 left-5'>
					<p className='bg-black/10 py-3 px-4 rounded-3xl text-zinc-200'>
						Loja da Fátima
					</p>
				</div>
				<div className='absolute bottom-5 right-5'>
					<Link
						href='/lojas/loja-da-fatima'
						className='text-zinc-200 flex gap-2 items-center justify-center hover:underline'
					>
						Ver Loja <ArrowRight className='size-5 mr-2' />
					</Link>
				</div>
			</div>
			{/* Categories section */}
			<CategoriesSection categoryId={categoryId} />
			{/* Featured stores avatar section */}
			<FeaturedStoresSection />
			{/* New products section */}
			<ProductsSection />
		</div>
	)
}
