'use client'

import { ArrowLeft, PackageSearch } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type SellerOrderDetailGatesProps = {
	isLoading: boolean
	isError: boolean
	isEmpty: boolean
	onRetry: () => void
}

export function SellerOrderDetailGates({
	isLoading,
	isError,
	isEmpty,
	onRetry,
}: SellerOrderDetailGatesProps) {
	if (isLoading) {
		return (
			<div className='w-full min-w-0 space-y-4'>
				<div className='h-8 w-48 animate-pulse rounded-lg bg-muted' />
				<div className='h-40 animate-pulse rounded-xl bg-muted' />
				<div className='h-56 animate-pulse rounded-xl bg-muted' />
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex w-full min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center'>
				<p className='font-heading text-lg font-bold'>
					Não foi possível carregar o pedido
				</p>
				<Button
					variant='outline'
					className='rounded-full'
					onClick={onRetry}
				>
					Tentar novamente
				</Button>
			</div>
		)
	}

	if (isEmpty) {
		return (
			<div className='flex w-full min-h-[50vh] flex-col items-center justify-center gap-4 px-4'>
				<div className='flex size-14 items-center justify-center rounded-xl bg-muted'>
					<PackageSearch className='size-7 text-muted-foreground' />
				</div>
				<div className='text-center'>
					<p className='font-heading text-lg font-bold'>
						Pedido não encontrado
					</p>
					<p className='mt-1 text-sm text-muted-foreground'>
						Este pedido não existe nesta loja ou foi removido.
					</p>
				</div>
				<Button
					variant='outline'
					className='rounded-full'
					render={<Link href='/dashboard/seller/pedidos' />}
				>
					<ArrowLeft className='size-4' />
					Voltar aos pedidos
				</Button>
			</div>
		)
	}

	return null
}
