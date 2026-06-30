/** biome-ignore-all lint/a11y/noStaticElementInteractions: <epp> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <epp> */
'use client'
import { useRouter } from 'next/navigation'
import { StoreAvatar } from '@/components/store-avatar'

export const MessagesView = () => {
	const router = useRouter()

	return (
		<div className='w-full min-w-0 px-4 mb-10'>
			<main className='flex flex-col gap-4 space-y-4 px-4'>
				<div className='p-4 bg-white border py-5.5 fixed top-0 right-0 left-0 md:left-74 z-50 md:right-8'>
					<h1 className='text-3xl font-semibold'>Mensagens</h1>
				</div>
				<div className='flex flex-col space-y-4 px-8 pt-24'>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className='h-18 w-full rounded-xl bg-white p-4 flex items-center gap-2 border py-8 cursor-pointer transition-all duration-200 hover:scale-101 hover:shadow-md'
							onClick={() => router.push('/mensagens/id')}
						>
							<div className='relative shrink-0 '>
								<StoreAvatar
									imageUrl='/placeholder.jpg'
									name='Loja da Fátima'
									size='lg'
								/>

								<span className='absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-secondary text-white text-[9px] flex items-center justify-center'>
									2
								</span>
							</div>

							<div className='flex-1 ml-3 flex flex-col justify-center space-y-1'>
								<h3 className='text-md font-semibold leading-tight'>
									Loja da Fátima
								</h3>

								<div className='text-muted-foreground text-xs leading-tight line-clamp-1'>
									Lorem ipsum dolor sit amet consectetur
									adipisicing elit. Quos, quidem!
								</div>
							</div>

							<div className='text-muted-foreground text-xs'>
								Ontem
							</div>
						</div>
					))}
				</div>
				<p className='text-center text-xs underline text-blue-400'>
					Carregar mais mensagens...
				</p>
			</main>
		</div>
	)
}
