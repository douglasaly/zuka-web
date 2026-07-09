'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SellerDashboardError({
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center px-4 text-center'>
			<div className='flex size-16 items-center justify-center rounded-full bg-destructive/10'>
				<AlertTriangle className='size-8 text-destructive' />
			</div>
			<h1 className='mt-6 font-heading text-3xl font-bold'>
				Algo correu mal
			</h1>
			<p className='mt-2 max-w-sm text-muted-foreground'>
				Ocorreu um erro inesperado no painel de vendedor. Tente
				novamente ou volte mais tarde.
			</p>
			<div className='mt-8 flex gap-3'>
				<Button
					variant='outline'
					className='rounded-full'
					onClick={() => {
						window.location.href = '/dashboard/seller'
					}}
				>
					Recarregar painel
				</Button>
				<Button className='rounded-full' onClick={reset}>
					Tentar novamente
				</Button>
			</div>
		</div>
	)
}
