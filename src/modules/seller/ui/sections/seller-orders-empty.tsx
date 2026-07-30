'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function SellerOrdersEmptyState() {
	return (
		<div className='flex w-full flex-col items-center rounded-xl border border-border bg-card px-6 py-16 text-center sm:py-20'>
			<div className='flex size-14 items-center justify-center rounded-xl bg-muted'>
				<ShoppingBag className='size-7 text-muted-foreground' />
			</div>
			<h2 className='mt-5 font-heading text-2xl font-bold tracking-tight'>
				Nenhum pedido ainda
			</h2>
			<p className='mt-2 max-w-md text-sm leading-relaxed text-muted-foreground'>
				Quando um cliente comprar na sua loja, o pedido aparece aqui
				para confirmar o envio e a entrega.
			</p>
			<Button
				variant='outline'
				className='mt-6 rounded-full'
				render={<Link href='/dashboard/seller/produtos' />}
			>
				Ver produtos
			</Button>
		</div>
	)
}

type SellerOrdersFilteredEmptyProps = {
	onClear: () => void
}

export function SellerOrdersFilteredEmpty({
	onClear,
}: SellerOrdersFilteredEmptyProps) {
	return (
		<div className='rounded-xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center'>
			<p className='text-sm text-muted-foreground'>
				Nenhum pedido corresponde aos filtros actuais.
			</p>
			<Button
				variant='ghost'
				size='sm'
				className='mt-3 rounded-full'
				onClick={onClear}
			>
				Limpar filtros
			</Button>
		</div>
	)
}

type SellerOrdersErrorStateProps = {
	onRetry: () => void
}

export function SellerOrdersErrorState({
	onRetry,
}: SellerOrdersErrorStateProps) {
	return (
		<div className='flex w-full min-w-0 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center'>
			<h2 className='font-heading text-lg font-bold tracking-tight'>
				Não foi possível carregar os pedidos
			</h2>
			<p className='mt-1.5 max-w-md text-sm text-muted-foreground'>
				Verifique a ligação e tente outra vez.
			</p>
			<Button
				className='mt-6 rounded-full'
				variant='outline'
				onClick={onRetry}
			>
				Tentar novamente
			</Button>
		</div>
	)
}
