import { FileQuestion } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { noIndexRobots } from '@/lib/seo/metadata'

export const metadata: Metadata = {
	title: 'Página não encontrada',
	robots: noIndexRobots,
}

export default function NotFound() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center px-4 text-center'>
			<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
				<FileQuestion className='size-8 text-muted-foreground' />
			</div>
			<h1 className='mt-6 font-heading text-3xl font-bold'>
				Página não encontrada
			</h1>
			<p className='mt-2 max-w-sm text-muted-foreground'>
				A página que procura não existe ou foi movida.
			</p>
			<Button
				className='mt-8 rounded-full'
				render={<Link href='/'>Voltar ao início</Link>}
			/>
		</div>
	)
}
