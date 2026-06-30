import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const FeaturedStoresHeader = () => (
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
)
