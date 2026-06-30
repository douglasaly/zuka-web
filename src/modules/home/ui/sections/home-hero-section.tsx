'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { fetchStores } from '@/lib/api/marketplace'

export const HomeHeroSection = () => {
	const { data: stores = [] } = useQuery({
		queryKey: ['hero-store'],
		queryFn: () => fetchStores({ limit: 1 }),
	})

	const featured = stores[0]

	return (
		<section className='relative overflow-hidden rounded-2xl md:rounded-3xl'>
			<div className='relative aspect-16/7 min-h-55 w-full sm:aspect-16/6 sm:min-h-70'>
				<Image
					src={featured?.bannerUrl ?? '/featured-placeholder.jpg'}
					alt={featured?.name ?? 'Destaque Zuka'}
					fill
					sizes='(max-width: 768px) 100vw, 1280px'
					className='object-cover'
					priority
				/>
				<div className='absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent' />
				<div className='absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent' />

				<div className='absolute inset-0 flex flex-col justify-between p-5 sm:p-8'>
					<div className='flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm'>
						<Sparkles className='size-3.5' />
						Destaque da semana
					</div>

					<div className='max-w-lg space-y-4'>
						<div className='space-y-2'>
							<h1 className='font-heading text-2xl font-bold leading-tight text-white sm:text-4xl'>
								{featured?.name ?? 'Descubra o Zuka'}
							</h1>
							<p className='text-sm text-white/85 sm:text-base'>
								{featured
									? `Compre em ${featured.location} · ${featured.neighborhood}`
									: 'O marketplace local de Moçambique'}
							</p>
						</div>

						<div className='flex flex-wrap items-center gap-3'>
							{featured ? (
								<>
									<Button
										render={
											<Link
												href={`/lojas/${featured.slug}`}
											/>
										}
										size='lg'
										className='rounded-full bg-white font-semibold text-foreground hover:bg-white/90'
									>
										Visitar loja
										<ArrowRight className='size-4' />
									</Button>
									<span className='rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm'>
										{featured.name}
									</span>
								</>
							) : (
								<Button
									render={<Link href='/feed/explorar' />}
									size='lg'
									className='rounded-full bg-white font-semibold text-foreground hover:bg-white/90'
								>
									Explorar
									<ArrowRight className='size-4' />
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
