'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowRight, LayoutGrid, List } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { fetchProducts, toProductCard } from '@/lib/api/marketplace'
import { ProductCard } from '../../../../components/product-card'

export default function ProductsSection() {
	const { data: products = [], isLoading } = useQuery({
		queryKey: ['home-products'],
		queryFn: () => fetchProducts({ limit: 8 }),
	})
	return (
		<section className='space-y-5'>
			<div className='flex items-end justify-between gap-4'>
				<div className='space-y-1'>
					<h2 className='font-heading text-xl font-bold tracking-tight md:text-2xl'>
						Novidades
					</h2>
					<p className='text-sm text-muted-foreground'>
						Os produtos mais recentes dos nossos vendedores
					</p>
				</div>

				<div className='flex items-center gap-1'>
					<Button
						variant='secondary'
						size='icon-sm'
						type='button'
						aria-label='Vista em grelha'
					>
						<LayoutGrid className='size-4' />
					</Button>
					<Button
						variant='ghost'
						size='icon-sm'
						type='button'
						aria-label='Vista em lista'
					>
						<List className='size-4' />
					</Button>
					<Button
						render={<Link href='/feed/explorar' />}
						variant='ghost'
						size='sm'
						className='ml-1 hidden text-secondary sm:inline-flex'
					>
						Ver todos
						<ArrowRight className='size-3.5' />
					</Button>
				</div>
			</div>

			{isLoading ? (
				<p className='text-sm text-muted-foreground'>
					A carregar produtos...
				</p>
			) : (
				<div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4'>
					{products.map((p) => (
						<ProductCard key={p.id} product={toProductCard(p)} />
					))}
				</div>
			)}

			{!isLoading && products.length === 0 && (
				<p className='text-sm text-muted-foreground'>
					Ainda não há produtos disponíveis.
				</p>
			)}
		</section>
	)
}
