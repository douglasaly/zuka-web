import { Ban } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SellerNotFound() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center px-4 text-center'>
			<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
				<Ban className='size-8 text-muted-foreground' />
			</div>
			<h1 className='mt-6 font-heading text-3xl font-bold'>
				Página não encontrada
			</h1>
			<p className='mt-2 max-w-sm text-muted-foreground'>
				A página que procura não existe no painel de vendedor.
			</p>
			<div className='mt-8 flex gap-3'>
				<Button variant='outline' className='rounded-full' asChild>
					<Link href='/'>Voltar ao início</Link>
				</Button>
				<Button className='rounded-full' asChild>
					<Link href='/dashboard/seller'>Ir para o painel</Link>
				</Button>
			</div>
		</div>
	)
}
