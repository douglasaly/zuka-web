'use client'

import { useQuery } from '@tanstack/react-query'
import { Store } from 'lucide-react'
import { fetchStores } from '@/lib/api/marketplace'
import { FeaturedStoresHeader } from '../components/featured-stores/featured-store-header'
import { FeaturedStoresList } from '../components/featured-stores/featured-store-list'
import { FeaturedStoresSkeleton } from '../components/featured-stores/featured-store-skeleton'

export const FeaturedStoresSection = () => {
	const { data: stores = [], isLoading } = useQuery({
		queryKey: ['featured-stores'],
		queryFn: () => fetchStores({ limit: 8 }),
	})

	return (
		<section className='space-y-5'>
			<FeaturedStoresHeader />

			{isLoading ? (
				<FeaturedStoresSkeleton />
			) : stores.length === 0 ? (
				<div className='flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 px-4 py-12 text-center'>
					<div className='flex size-12 items-center justify-center rounded-full bg-muted'>
						<Store className='size-6 text-muted-foreground' />
					</div>
					<p className='text-sm text-muted-foreground'>
						Ainda não há lojas disponíveis.
					</p>
				</div>
			) : (
				<FeaturedStoresList stores={stores} />
			)}
		</section>
	)
}
