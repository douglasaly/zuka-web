'use client'

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { StoreAvatar } from '@/components/store-avatar'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCartItemCount, useCartList, useHasHydrated } from '@/hooks/use-cart'
import { STORE_PLACEHOLDER } from '@/lib/constants/images'
import {
	cartCurrency,
	cartItemCount,
	cartTotal,
} from '@/modules/cart/lib/cart-utils'
import { formatPrice } from '@/utils/format-price'

export function CartDropdown() {
	const hasHydrated = useHasHydrated()
	const itemCount = useCartItemCount()
	const carts = useCartList()
	const visibleCount = hasHydrated ? itemCount : 0

	const label =
		visibleCount > 0 ? `Carrinho (${visibleCount} itens)` : 'Carrinho'

	return (
		<Popover>
			<Tooltip>
				<TooltipTrigger
					render={
						<PopoverTrigger
							render={
								<Button
									variant='ghost'
									size='icon-sm'
									type='button'
									aria-label={label}
									className='relative'
								>
									<ShoppingCart className='size-4' />
									{visibleCount > 0 && (
										<span className='absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground ring-2 ring-background'>
											{visibleCount > 9
												? '9+'
												: visibleCount}
										</span>
									)}
								</Button>
							}
						/>
					}
				/>
				<TooltipContent side='bottom'>{label}</TooltipContent>
			</Tooltip>

			<PopoverContent
				align='end'
				sideOffset={8}
				className='w-95 p-0 shadow-lg'
			>
				<div className='flex items-center justify-between border-b border-border/60 px-4 py-3.5'>
					<div className='flex items-center gap-2'>
						<span className='font-semibold'>Carrinho</span>
						{visibleCount > 0 && (
							<span className='rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground'>
								{visibleCount}
							</span>
						)}
					</div>
				</div>

				<div className='max-h-105 overflow-y-auto'>
					{!hasHydrated || carts.length === 0 ? (
						<div className='flex flex-col items-center justify-center gap-2 px-5 py-10'>
							<div className='flex size-12 items-center justify-center rounded-full bg-muted'>
								<ShoppingCart className='size-5 text-muted-foreground/60' />
							</div>
							<p className='text-sm font-medium'>
								Escolhe um produto e fala com a loja
							</p>
							<p className='max-w-[16rem] text-center text-xs text-muted-foreground'>
								Junta o que queres numa loja e envia o pedido
								por WhatsApp ou chat.
							</p>
						</div>
					) : (
						<div className='py-1'>
							{carts.map((cart) => (
								<Link
									key={cart.storeId}
									href='/carrinho'
									className='flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50'
								>
									<StoreAvatar
										name={cart.storeName}
										imageUrl={
											cart.storeAvatar ??
											STORE_PLACEHOLDER
										}
										size='sm'
									/>
									<div className='min-w-0 flex-1'>
										<p className='truncate text-sm font-medium'>
											{cart.storeName}
										</p>
										<p className='text-xs text-muted-foreground'>
											{cartItemCount(cart) === 1
												? '1 item'
												: `${cartItemCount(cart)} itens`}
										</p>
									</div>
									<p className='shrink-0 text-sm font-semibold tabular-nums'>
										{formatPrice(
											cartTotal(cart),
											cartCurrency(cart)
										)}
									</p>
								</Link>
							))}
						</div>
					)}
				</div>

				<div className='border-t border-border/60 p-2'>
					<Button
						variant='ghost'
						className='w-full justify-center text-sm font-medium text-secondary hover:text-secondary/80'
						render={
							<Link
								href={
									carts.length === 0
										? '/feed/explorar'
										: '/carrinho'
								}
							/>
						}
					>
						{carts.length === 0
							? 'Explorar produtos'
							: 'Ver o carrinho'}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}
