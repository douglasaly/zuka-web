'use client'

import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRODUCT_STATUS_OPTIONS, type ProductStatusValue } from './constants'

type ProductStatusFieldProps = {
	value: ProductStatusValue
	onChange: (value: ProductStatusValue) => void
}

export function ProductStatusField({
	value,
	onChange,
}: ProductStatusFieldProps) {
	return (
		<div className='space-y-2'>
			{PRODUCT_STATUS_OPTIONS.map((option) => {
				const selected = value === option.value
				return (
					<button
						key={option.value}
						type='button'
						aria-pressed={selected}
						onClick={() => onChange(option.value)}
			className={cn(
				'flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors duration-150',
				selected
					? 'border-foreground/20 bg-foreground/3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
					: 'border-border/60 hover:border-foreground/15 hover:bg-muted/40'
			)}
					>
						<span
							className={cn(
								'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
								selected
									? 'border-foreground bg-foreground text-background'
									: 'border-border text-transparent'
							)}
						>
							{selected ? (
								<Check className='size-3' strokeWidth={3} />
							) : (
								<Circle className='size-2.5 opacity-0' />
							)}
						</span>
						<span className='min-w-0 flex-1'>
							<span className='block text-sm font-semibold'>
								{option.label}
							</span>
							<span className='mt-0.5 block text-xs leading-relaxed break-words text-muted-foreground'>
								{option.description}
							</span>
						</span>
					</button>
				)
			})}
		</div>
	)
}
