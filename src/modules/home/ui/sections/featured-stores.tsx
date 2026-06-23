import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { StoreAvatar } from '@/components/store-avatar'

export const FeaturedStoresSection = () => {
	return (
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
			<div className='flex gap-4 overflow-x-auto scrollbar-hide'>
				{Array.from({ length: 3 }, (_, index) => (
					<div
						key={index}
						className='flex flex-col items-center shrink-0 group w-24'
					>
						<div className='border-4 border-gray-200 rounded-full'>
							<Link href='/lojas/loja-da-fatima' prefetch>
								<StoreAvatar
									imageUrl='/placeholder.jpg'
									name='Loja da Fátima'
									size='xl'
								/>
							</Link>
						</div>

						<div className='mt-2 w-full'>
							<Link href='/lojas/loja-da-fatima' prefetch>
								<div className='relative w-full overflow-hidden'>
									<span className='block whitespace-nowrap text-sm font-semibold animate-marquee-hover'>
										Loja da Fátima Muito Grande e Com Nome
										Gigante
									</span>

									{/* Fade à direita */}
									<div className='pointer-events-none absolute right-0 top-0 h-full w-6 bg-linear-to-l from-background to-transparent' />
								</div>
							</Link>

							<span className='block text-center text-xs text-muted-foreground'>
								Maputo • Baixa
							</span>
						</div>
					</div>
				))}

				<div className='flex flex-col items-center shrink-0 group w-24'>
					<div className='border-4 border-green-500 rounded-full'>
						<Link href='/lojas/loja-da-fatima' prefetch>
							<StoreAvatar
								imageUrl='/placeholder.jpg'
								name='Loja da Fátima'
								size='xl'
							/>
						</Link>
					</div>

					<div className='mt-2 w-full'>
						<Link href='/lojas/loja-da-fatima' prefetch>
							<div className='relative w-full overflow-hidden'>
								<span className='block whitespace-nowrap text-sm font-semibold animate-marquee-hover'>
									Loja da Fátima Muito Grande e Com Nome
									Gigante
								</span>

								{/* Fade à direita */}
								<div className='pointer-events-none absolute right-0 top-0 h-full w-6 bg-linear-to-l from-background to-transparent' />
							</div>
						</Link>

						<span className='block text-center text-xs text-muted-foreground'>
							Maputo • Baixa
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
