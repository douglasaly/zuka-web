import { ArrowRight, Store } from 'lucide-react'
import Link from 'next/link'

export const StoreNotFound = () => {
	return (
		<div className='flex flex-col items-center justify-center text-sm max-md:px-4 py-12 h-full min-h-[60vh]'>
			<Store size={48} className='text-muted-foreground mb-6' />
			<h1 className='text-2xl md:text-3xl font-bold text-muted-foreground bg-clip-text text-center'>
				Loja Não Encontrada
			</h1>
			<div className='h-px w-80 rounded bg-linear-to-r from-gray-400 to-gray-800 my-5 md:my-7' />
			<p className='text-sm md:text-base text-muted-foreground max-w-lg text-center'>
				Lamentamos, mas a loja que procura não está disponível.
			</p>
			<div className='flex flex-col sm:flex-row items-center gap-3 mt-10'>
				<Link
					href='/feed/explorar?tab=stores'
					className='group flex items-center gap-1 bg-white hover:bg-gray-200 px-7 py-2.5 text-muted-foreground rounded-full font-medium active:scale-95 transition-all'
				>
					Ver Todas as Lojas
					<ArrowRight
						className='size-4 group-hover:translate-x-0.5 transition'
						aria-hidden='true'
					/>
				</Link>
			</div>
		</div>
	)
}
