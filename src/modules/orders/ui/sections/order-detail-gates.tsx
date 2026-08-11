'use client'

import { PackageSearch, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { OrderDetailSkeleton } from '../components/order-detail-skeleton'

type OrderDetailGatesProps = {
	isLoading: boolean
	isError: boolean
	isEmpty: boolean
	isFetching: boolean
	onRetry: () => void
}

export function OrderDetailGates({
	isLoading,
	isError,
	isEmpty,
	isFetching,
	onRetry,
}: OrderDetailGatesProps) {
	if (isLoading) {
		return (
			// biome-ignore lint/a11y/useAriaPropsSupportedByRole: loading region uses aria-busy + label
			<div aria-busy='true' aria-label='A carregar o pedido'>
				<OrderDetailSkeleton />
			</div>
		)
	}

	if (isError) {
		return (
			<div className='mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]'>
				<div className='flex size-14 items-center justify-center rounded-full bg-muted'>
					<RefreshCw className='size-7 text-muted-foreground' />
				</div>
				<div className='text-center'>
					<p className='font-heading text-lg font-semibold tracking-tight'>
						Não foi possível carregar o pedido
					</p>
					<p className='mt-1 text-sm text-muted-foreground'>
						Verifica a ligação e tenta outra vez.
					</p>
				</div>
				<div className='flex w-full max-w-xs flex-col gap-2 sm:flex-row sm:justify-center'>
					<Button
						variant='outline'
						className='min-h-11 rounded-full'
						disabled={isFetching}
						onClick={onRetry}
					>
						{isFetching ? 'A tentar…' : 'Tentar novamente'}
					</Button>
					<Button
						variant='ghost'
						className='min-h-11 rounded-full'
						render={<Link href='/feed/pedidos' />}
					>
						Voltar aos pedidos
					</Button>
				</div>
			</div>
		)
	}

	if (isEmpty) {
		return (
			<div className='mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]'>
				<div className='flex size-14 items-center justify-center rounded-full bg-muted'>
					<PackageSearch className='size-7 text-muted-foreground' />
				</div>
				<div className='text-center'>
					<p className='font-heading text-lg font-semibold tracking-tight'>
						Pedido não encontrado
					</p>
					<p className='mt-1 text-sm text-muted-foreground'>
						Este pedido não existe ou já não está disponível.
					</p>
				</div>
				<Button
					render={<Link href='/feed/pedidos' />}
					variant='outline'
					className='min-h-11 rounded-full'
				>
					Voltar aos pedidos
				</Button>
			</div>
		)
	}

	return null
}
