import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const ProductNotFound = () => {
	return (
		<div className='flex flex-col items-center justify-center text-sm max-md:px-4 py-12 h-full min-h-[60vh]'>
			<svg
				className='w-14 h-14 md:w-16 md:h-16 text-muted-foreground mb-6'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				aria-hidden='true'
			>
				<path
					d='M21 8L12 3L3 8M21 8L12 13M21 8V16L12 21M12 13L3 8M12 13V21M3 8V16L12 21'
					stroke='currentColor'
					strokeWidth='1.5'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
				<line
					x1='4'
					y1='20'
					x2='20'
					y2='4'
					stroke='currentColor'
					strokeWidth='1.5'
					strokeLinecap='round'
				/>
			</svg>
			<h1 className='text-2xl md:text-3xl font-bold text-muted-foreground bg-clip-text text-center'>
				Produto Não Encontrado
			</h1>
			<div className='h-px w-80 rounded bg-linear-to-r from-gray-400 to-gray-800 my-5 md:my-7' />
			<p className='text-sm md:text-base text-muted-foreground max-w-lg text-center'>
				Lamentamos, mas o produto que procura não está disponível.
			</p>
			<div className='flex flex-col sm:flex-row items-center gap-3 mt-10'>
				<Link
					href='/feed/explorar'
					className='group flex items-center gap-1 bg-white hover:bg-gray-200 px-7 py-2.5 text-muted-foreground rounded-full font-medium active:scale-95 transition-all'
				>
					Ver Todos os Produtos
					<ArrowRight
						className='size-4 group-hover:translate-x-0.5 transition'
						aria-hidden='true'
					/>
				</Link>
			</div>
		</div>
	)
}
