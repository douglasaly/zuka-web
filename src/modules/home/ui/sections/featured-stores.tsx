'use client'

import { useQuery } from '@tanstack/react-query'
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
				<p className='text-sm text-muted-foreground'>
					Ainda não há lojas disponíveis.
				</p>
			) : (
				<FeaturedStoresList stores={stores} />
			)}
		</section>
	)
}
