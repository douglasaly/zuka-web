'use client'

import { ArrowRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { StoreAvatar } from '@/components/store-avatar'
import { fetchStores } from '@/lib/api/marketplace'
import { cn } from '@/lib/utils'

export const FeaturedStoresSection = () => {
	const { data: stores = [], isLoading } = useQuery({
		queryKey: ['featured-stores'],
		queryFn: () => fetchStores({ limit: 8 }),
	})

	return (
		<section className='space-y-5'>
			<div className='flex items-end justify-between gap-4'>
				<div className='space-y-1'>
					<h2 className='font-heading text-xl font-bold tracking-tight md:text-2xl'>
						Lojas em Destaque
					</h2>
					<p className='text-sm text-muted-foreground'>
						Vendedores verificados perto de si
					</p>
				</div>
				<Button
					render={<Link href='/feed/explorar' />}
					variant='ghost'
					size='sm'
					className='shrink-0 text-secondary'
				>
					Ver todas
					<ArrowRight className='size-3.5' />
				</Button>
			</div>

			{isLoading ? (
				<p className='text-sm text-muted-foreground'>A carregar lojas...</p>
			) : (
				<div className='flex gap-4 overflow-x-auto pb-1 scrollbar-hide sm:gap-5'>
					{stores.map((store, index) => (
						<Link
							key={store.id}
							href={`/lojas/${store.slug}`}
							prefetch
							className='group flex w-[88px] shrink-0 flex-col items-center sm:w-24'
						>
							<div
								className={cn(
									'rounded-full p-0.5 transition-all duration-300',
									'ring-2 ring-border group-hover:ring-secondary/40',
									index === 0 && 'ring-secondary/30'
								)}
							>
								<StoreAvatar
									imageUrl={store.logoUrl ?? '/placeholder.jpg'}
									name={store.name}
									size='xl'
									className='size-16 transition-transform duration-300 group-hover:scale-105 sm:size-[4.5rem]'
								/>
							</div>

							<div className='mt-2.5 w-full text-center'>
								<p className='truncate text-xs font-semibold text-foreground transition-colors group-hover:text-secondary sm:text-sm'>
									{store.name}
								</p>
								<p className='mt-0.5 flex items-center justify-center gap-0.5 text-[10px] text-muted-foreground sm:text-xs'>
									<MapPin className='size-2.5 shrink-0' />
									<span className='truncate'>
										{store.location} · {store.neighborhood}
									</span>
								</p>
							</div>
						</Link>
					))}
				</div>
			)}

			{!isLoading && stores.length === 0 && (
				<p className='text-sm text-muted-foreground'>
					Ainda não há lojas disponíveis.
				</p>
			)}
		</section>
	)
}