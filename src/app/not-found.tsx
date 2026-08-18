import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { noIndexRobots } from '@/lib/seo/metadata'

export const metadata: Metadata = {
	title: '404',
	robots: noIndexRobots,
}

export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center text-sm max-md:px-4 py-20 h-dvh'>
			<h1 className='text-4xl md:text-5xl font-bold text-muted-foreground bg-clip-text'>
				404 Página Não Encontrada
			</h1>
			<div className='h-px w-80 rounded bg-linear-to-r from-gray-400 to-gray-800 my-5 md:my-7' />
			<p className='md:text-xl text-muted-foreground max-w-lg text-center'>
				A página que procura não existe ou foi removida.
			</p>
			<Link
				href='/'
				className='group flex items-center gap-1 bg-white hover:bg-gray-200 px-7 py-2.5 text-muted-foreground rounded-full mt-10 font-medium active:scale-95 transition-all'
			>
				Voltar ao Início
				<ArrowRight
					className='size-4 group-hover:translate-x-0.5 transition'
					aria-hidden='true'
					aria-label='Voltar ao início'
					aria-describedby='Voltar ao início'
				/>
			</Link>
		</div>
	)
}
