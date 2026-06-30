'use client'

import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ExploreProductCard } from '@/components/explore-product-card'
import { SegmentedControl } from '@/components/segmented-control'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	fetchProducts,
	fetchStores,
	STORE_PLACEHOLDER,
} from '@/lib/api/marketplace'
import { cn } from '@/lib/utils'

interface Category {
	id: string
	name: string
}

export const ExploreView = () => {
	const searchParams = useSearchParams()
	const initialTab =
		searchParams.get('tab') === 'stores' ? 'stores' : 'products'
	const [tab, setTab] = useState(initialTab)

	useEffect(() => {
		const tabParam = searchParams.get('tab')
		if (tabParam === 'stores' || tabParam === 'products') {
			setTab(tabParam)
		}
	}, [searchParams])
	const [category, setCategory] = useState('all')
	const [search, setSearch] = useState('')

	const { data: categories = [] } = useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await fetch('/api/categories')
			if (!res.ok) throw new Error('Failed to load categories')
			return res.json()
		},
	})

	const { data: products = [], isLoading: productsLoading } = useQuery({
		queryKey: ['explore-products', category, search],
		queryFn: () =>
			fetchProducts({
				category: category === 'all' ? undefined : category,
				search: search || undefined,
				limit: 50,
			}),
		enabled: tab === 'products',
	})

	const { data: stores = [], isLoading: storesLoading } = useQuery({
		queryKey: ['explore-stores', search],
		queryFn: () => fetchStores({ search: search || undefined }),
		enabled: tab === 'stores',
	})

	const categoryOptions = useMemo(
		() => [
			{ value: 'all', label: 'Todos' },
			...categories.map((c) => ({ value: c.id, label: c.name })),
		],
		[categories]
	)

	return (
		<div className='mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8'>
			<div className='space-y-5'>
				<div className='flex gap-2'>
					<div className='relative flex-1'>
						<Search className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder='Procurar produtos, lojas...'
							className='h-12 rounded-xl border border-border/60 bg-muted/30 pl-10 shadow-none'
						/>
					</div>
					<Button
						variant='outline'
						size='icon-lg'
						type='button'
						className='shrink-0 rounded-lg border-border/60 h-12'
						aria-label='Filtros'
					>
						<SlidersHorizontal className='size-4' />
					</Button>
				</div>

				<SegmentedControl
					options={[
						{ value: 'products', label: 'Produtos' },
						{ value: 'stores', label: 'Lojas' },
					]}
					value={tab}
					onChange={setTab}
				/>

				{tab === 'products' && (
					<>
						<div className='flex gap-2 overflow-x-auto pb-1 scrollbar-hide'>
							{categoryOptions.map((cat) => (
								<button
									key={cat.value}
									type='button'
									onClick={() => setCategory(cat.value)}
									className={cn(
										'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer',
										category === cat.value
											? 'border-primary bg-primary text-primary-foreground'
											: 'border-border/70 bg-background text-muted-foreground hover:border-secondary/30 hover:bg-secondary/5'
									)}
								>
									{cat.label}
								</button>
							))}
						</div>

						<p className='text-sm text-muted-foreground'>
							{productsLoading
								? 'A carregar...'
								: `${products.length} produto${products.length !== 1 ? 's' : ''}`}
						</p>

						<div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4'>
							{products.map((product) => (
								<ExploreProductCard
									key={product.id}
									product={product}
								/>
							))}
						</div>

						{!productsLoading && products.length === 0 && (
							<p className='py-12 text-center text-sm text-muted-foreground'>
								Nenhum produto encontrado.
							</p>
						)}
					</>
				)}

				{tab === 'stores' && (
					<>
						<p className='text-sm text-muted-foreground'>
							{storesLoading
								? 'A carregar...'
								: `${stores.length} loja${stores.length !== 1 ? 's' : ''}`}
						</p>

						<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
							{stores.map((store) => (
								<Link
									key={store.id}
									href={`/lojas/${store.slug}`}
									className='group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5'
								>
									<div className='relative size-16 shrink-0 overflow-hidden rounded-xl'>
										<Image
											src={
												store.logoUrl ??
												STORE_PLACEHOLDER
											}
											alt={store.name}
											fill
											className='object-cover'
										/>
									</div>
									<div className='min-w-0 flex-1'>
										<p className='truncate font-semibold group-hover:text-secondary'>
											{store.name}
										</p>
										<p className='text-sm text-muted-foreground'>
											{store.location} ·{' '}
											{store.neighborhood}
										</p>
										<p className='mt-0.5 text-xs text-muted-foreground'>
											★ {store.rating} ·{' '}
											{store.productCount} produtos
										</p>
									</div>
								</Link>
							))}
						</div>

						{!storesLoading && stores.length === 0 && (
							<p className='py-12 text-center text-sm text-muted-foreground'>
								Nenhuma loja encontrada.
							</p>
						)}
					</>
				)}
			</div>
		</div>
	)
}
