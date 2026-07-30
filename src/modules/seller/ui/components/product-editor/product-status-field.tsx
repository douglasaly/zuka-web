'use client'

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
		<div className='space-y-3'>
			<div>
				<p className='text-sm font-semibold'>Estado</p>
				<p className='text-xs text-muted-foreground'>
					Controla a visibilidade do produto na loja.
				</p>
			</div>
			<div className='grid gap-2 sm:grid-cols-2'>
				{PRODUCT_STATUS_OPTIONS.map((option) => {
					const selected = value === option.value
					return (
						<button
							key={option.value}
							type='button'
							onClick={() => onChange(option.value)}
							className={cn(
								'rounded-xl border px-4 py-3 text-left transition-colors',
								selected
									? 'border-primary bg-primary/5'
									: 'border-border/60 hover:border-foreground/20 hover:bg-muted/40'
							)}
						>
							<p className='text-sm font-semibold'>
								{option.label}
							</p>
							<p className='mt-1 text-xs text-muted-foreground'>
								{option.description}
							</p>
						</button>
					)
				})}
			</div>
		</div>
	)
}
