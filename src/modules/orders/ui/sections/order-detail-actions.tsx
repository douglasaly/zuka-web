'use client'

import { MessageCircle, RotateCcw, Store } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { BuyerOrder } from '@/modules/orders/types'

type OrderDetailActionsProps = {
	order: BuyerOrder
	showBuyAgain: boolean
	firstProductId: string | null | undefined
	hasMobileActions: boolean
}

export function OrderDetailDesktopActions({
	order,
	showBuyAgain,
	firstProductId,
}: Pick<OrderDetailActionsProps, 'order' | 'showBuyAgain' | 'firstProductId'>) {
	return (
		<section
			className='hidden flex-col gap-2 sm:flex lg:flex-row'
			aria-label='Acções do pedido'
		>
			{order.conversationId ? (
				<Button
					className='min-h-11 flex-1 rounded-xl  text-secondary-foreground'
					render={
						<Link href={`/mensagens/${order.conversationId}`} />
					}
				>
					<MessageCircle className='size-4' aria-hidden />
					Falar com a loja
				</Button>
			) : null}
			{showBuyAgain ? (
				<Button
					variant='outline'
					className='min-h-11 flex-1 rounded-xl'
					render={<Link href={`/product/${firstProductId}`} />}
				>
					<RotateCcw className='size-4' aria-hidden />
					Comprar de novo
				</Button>
			) : null}
		</section>
	)
}

export function OrderDetailMobileActions({
	order,
	showBuyAgain,
	firstProductId,
	hasMobileActions,
}: OrderDetailActionsProps) {
	if (!hasMobileActions) return null

	return (
		<div className='fixed inset-x-0 bottom-0 z-20 border-t border-border/60 bg-background/95 p-3 backdrop-blur-md supports-backdrop-filter:bg-background/85 sm:hidden'>
			<div className='mx-auto flex max-w-7xl gap-2 pb-[env(safe-area-inset-bottom)]'>
				{order.conversationId ? (
					<Button
						variant='default'
						className='min-h-12 flex-1 rounded-xl  text-secondary-foreground'
						render={
							<Link href={`/mensagens/${order.conversationId}`} />
						}
					>
						<MessageCircle className='size-4' aria-hidden />
						Falar com a loja
					</Button>
				) : order.storeSlug ? (
					<Button
						className='min-h-12 flex-1 rounded-xl'
						render={<Link href={`/lojas/${order.storeSlug}`} />}
					>
						<Store className='size-4' aria-hidden />
						Ver loja
					</Button>
				) : null}
				{showBuyAgain ? (
					<Button
						variant='outline'
						className='min-h-12 flex-1 rounded-xl'
						render={<Link href={`/product/${firstProductId}`} />}
					>
						<RotateCcw className='size-4' aria-hidden />
						Comprar de novo
					</Button>
				) : null}
			</div>
		</div>
	)
}
