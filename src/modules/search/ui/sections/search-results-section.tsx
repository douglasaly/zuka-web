'use client'

import { ChevronRight, Tag } from 'lucide-react'
import Link from 'next/link'
import type { SearchResults } from '@/app/api/search/route'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { ExploreStoreCard } from '@/modules/explore/ui/components/explore-store-card'

interface Props {
	data: SearchResults
	q: string
	category: string
	resultLabel: React.ReactNode
}

export function SearchResultsSection({
	data,
	q,
	category,
	resultLabel,
}: Props) {
	return (
		<div className='space-y-8'>
			<p className='text-sm text-muted-foreground'>{resultLabel}</p>

			{(data?.products?.length ?? 0) > 0 && (
				<section>
					<div className='mb-3 flex items-center justify-between'>
						<h2 className='text-lg font-semibold'>Produtos</h2>
						<Link
							href={
								q
									? `/feed/explorar?q=${encodeURIComponent(q)}${category ? `&categoria=${encodeURIComponent(category)}` : ''}`
									: `/feed/explorar${category ? `?categoria=${encodeURIComponent(category)}` : ''}`
							}
							className='flex items-center gap-1 text-sm text-secondary hover:underline'
						>
							Ver todos <ChevronRight className='size-3.5' />
						</Link>
					</div>
					<div className='grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6'>
						{data?.products?.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</section>
			)}

			{(data?.stores?.length ?? 0) > 0 && (
				<section>
					<div className='mb-3 flex items-center justify-between'>
						<h2 className='text-lg font-semibold'>Lojas</h2>
						<Link
							href={`/feed/explorar?tab=stores&q=${encodeURIComponent(q)}`}
							className='flex items-center gap-1 text-sm text-secondary hover:underline'
						>
							Ver todas <ChevronRight className='size-3.5' />
						</Link>
					</div>
					<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
						{data?.stores?.map((store) => (
							<ExploreStoreCard key={store.id} store={store} />
						))}
					</div>
				</section>
			)}

			{(data?.categories?.length ?? 0) > 0 && (
				<section>
					<div className='mb-3 flex items-center justify-between'>
						<h2 className='text-lg font-semibold'>Categorias</h2>
					</div>
					<div className='flex flex-wrap gap-2'>
						{data?.categories?.map((cat) => (
							<Link
								key={cat.id}
								href={`/feed/explorar?categoria=${cat.slug}`}
							>
								<Button
									variant='outline'
									className='rounded-full'
									size='sm'
								>
									<Tag className='mr-1.5 size-3.5' />
									{cat.name}
								</Button>
							</Link>
						))}
					</div>
				</section>
			)}
		</div>
	)
}
