'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MAX_CART_QUANTITY } from '@/modules/cart/types'

type CartQtyStepperProps = {
	value: number
	disabled?: boolean
	onChange: (quantity: number) => void
}

export function CartQtyStepper({
	value,
	disabled,
	onChange,
}: CartQtyStepperProps) {
	return (
		<div className='inline-flex h-11 items-center rounded-full border border-border/70 bg-background'>
			<Button
				type='button'
				variant='ghost'
				size='icon-sm'
				className='rounded-full'
				disabled={disabled || value <= 1}
				aria-label='Diminuir quantidade'
				onClick={() => onChange(value - 1)}
			>
				<Minus className='size-3.5' />
			</Button>
			<span className='min-w-8 text-center text-sm font-medium tabular-nums'>
				{value}
			</span>
			<Button
				type='button'
				variant='ghost'
				size='icon-sm'
				className='rounded-full'
				disabled={disabled || value >= MAX_CART_QUANTITY}
				aria-label='Aumentar quantidade'
				onClick={() => onChange(value + 1)}
			>
				<Plus className='size-3.5' />
			</Button>
		</div>
	)
}
