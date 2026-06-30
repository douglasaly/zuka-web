'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { fetchStoreBySlug } from '@/lib/api/marketplace'
import { StoreAboutPanel } from '../components/store-about-panel'
import { StoreHero } from '../components/store-hero'
import { StoreInfoCard } from '../components/store-info-card'
import { StoreProductsGrid } from '../components/store-products-grid'
import { StoreReviewsPanel } from '../components/store-review-panel'
import { StoreSkeleton } from '../components/store-skeleton'
import { StoreTabs } from '../components/store-tabs'

interface StoreViewProps {
	slug: string
}

export const StoreView = ({ slug }: StoreViewProps) => {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState('products')
	const [isSaved, setIsSaved] = useState(false)

	const { data, isLoading } = useQuery({
		queryKey: ['store', slug],
		queryFn: () => fetchStoreBySlug(slug),
	})

	if (isLoading) {
		return <StoreSkeleton />
	}

	if (!data) {
		return (
			<div className='flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4'>
				<p className='text-muted-foreground'>Loja não encontrada.</p>
				<Button
					render={<Link href='/feed/explorar' />}
					variant='outline'
				>
					Voltar a explorar
				</Button>
			</div>
		)
	}

	const { store, products } = data

	const handleToggleSave = () => {
		setIsSaved((prev) => !prev)
		// TODO: chamar API para guardar/remover loja dos guardados
	}

	const handleShare = async () => {
		const url = typeof window !== 'undefined' ? window.location.href : ''

		if (navigator.share) {
			try {
				await navigator.share({ title: store.name, url })
			} catch {
				// utilizador cancelou a partilha
			}
			return
		}

		await navigator.clipboard.writeText(url)
		// TODO: mostrar toast "Link copiado"
	}

	return (
		<div className='pb-10'>
			<StoreHero
				store={store}
				onBack={() => router.back()}
				isSaved={isSaved}
				onToggleSave={handleToggleSave}
				onShare={handleShare}
			/>

			<div className='mx-auto max-w-4xl px-4 md:px-6'>
				<StoreInfoCard store={store} />

				<StoreTabs value={activeTab} onChange={setActiveTab} />

				<div className='mt-6'>
					{activeTab === 'products' && (
						<StoreProductsGrid products={products} />
					)}

					{activeTab === 'about' && (
						<StoreAboutPanel about={store.about} />
					)}

					{activeTab === 'reviews' && (
						<StoreReviewsPanel
							rating={store.rating}
							reviewCount={store.reviewCount}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
