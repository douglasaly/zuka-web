'use client'

import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PRODUCT_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { cn } from '@/lib/utils'
import { lineTotal } from '@/modules/cart/lib/cart-utils'
import type { CartItem, ReconciledProduct } from '@/modules/cart/types'
import { formatPrice } from '@/utils/format-price'
import { CartQtyStepper } from './cart-qty-stepper'

type CartItemRowProps = {
	item: CartItem
	reconcile?: ReconciledProduct
	onQuantityChange: (quantity: number) => void
	onRemove: () => void
	onApplyCurrentPrice: (unitPrice: number) => void
}

export function CartItemRow({
	item,
	reconcile,
	onQuantityChange,
	onRemove,
	onApplyCurrentPrice,
}: CartItemRowProps) {
	const unavailable = Boolean(reconcile?.unavailable)
	const priceChanged = Boolean(reconcile?.priceChanged)
	const currentPrice = reconcile?.currentPrice

	return (
		<div
			className={cn(
				'flex gap-3 p-4 sm:gap-4',
				unavailable && 'opacity-70'
			)}
		>
			<div className='relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-18'>
				<Image
					src={item.image ?? PRODUCT_PLACEHOLDER}
					alt=''
					fill
					placeholder='blur'
					blurDataURL={BLUR_PLACEHOLDER}
					sizes='72px'
					className='object-cover'
				/>
			</div>

			<div className='min-w-0 flex-1 space-y-2'>
				<div className='flex items-start justify-between gap-2'>
					<Link
						href={`/product/${item.productId}`}
						className='line-clamp-2 font-medium text-foreground underline-offset-2 hover:underline'
					>
						{item.name}
					</Link>
					<p className='shrink-0 text-sm font-semibold tabular-nums'>
						{formatPrice(lineTotal(item), item.currency)}
					</p>
				</div>

				<p className='text-xs text-muted-foreground'>
					{formatPrice(item.unitPrice, item.currency)} cada
				</p>

				{unavailable ? (
					<p className='text-xs font-medium text-destructive'>
						Já não está à venda. Remove-o para continuares.
					</p>
				) : null}

				{priceChanged && currentPrice != null ? (
					<div className='flex flex-wrap items-center gap-2'>
						<p className='text-xs text-amber-800 dark:text-amber-300'>
							O preço passou de{' '}
							{formatPrice(item.unitPrice, item.currency)} para{' '}
							{formatPrice(currentPrice, item.currency)}.
						</p>
						<Button
							type='button'
							variant='outline'
							size='xs'
							onClick={() => onApplyCurrentPrice(currentPrice)}
						>
							Usar preço actual
						</Button>
					</div>
				) : null}

				<div className='flex items-center justify-between gap-2'>
					<CartQtyStepper
						value={item.quantity}
						disabled={unavailable}
						onChange={onQuantityChange}
					/>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='min-h-9 rounded-full px-3 text-muted-foreground hover:text-destructive'
						aria-label={`Remover ${item.name} do carrinho`}
						onClick={onRemove}
					>
						<Trash2 className='size-3.5' aria-hidden />
						Remover
					</Button>
				</div>
			</div>
		</div>
	)
}
