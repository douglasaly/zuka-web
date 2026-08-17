'use client'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type StarRatingInputProps = {
	id: string
	label: string
	value: number
	onChange: (value: number) => void
	disabled?: boolean
	error?: string | null
}
const LABELS = ['Muito mau', 'Mau', 'Razoável', 'Bom', 'Excelente'] as const
export function StarRatingInput({
	id,
	label,
	value,
	onChange,
	disabled,
	error,
}: StarRatingInputProps) {
	return (
		<div className='space-y-2'>
			<div className='flex items-center justify-between gap-3'>
				<label
					id={`${id}-label`}
					htmlFor={`${id}-1`}
					className='text-sm font-medium text-foreground'
				>
					{label}
				</label>
				{value > 0 ? (
					<span className='text-xs text-muted-foreground'>
						{LABELS[value - 1]}
					</span>
				) : null}
			</div>
			<div
				role='radiogroup'
				aria-labelledby={`${id}-label`}
				aria-required
				aria-invalid={Boolean(error) || undefined}
				aria-describedby={error ? `${id}-error` : undefined}
				className='flex items-center gap-1'
			>
				{[1, 2, 3, 4, 5].map((star) => {
					const selected = value >= star
					return (
						<button
							key={star}
							id={`${id}-${star}`}
							type='button'
							role='radio'
							aria-checked={value === star}
							aria-label={`${star} de 5, ${LABELS[star - 1]}`}
							disabled={disabled}
							onClick={() => onChange(star)}
							className={cn(
								'flex size-10 items-center justify-center rounded-full transition-colors',
								'hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
								'disabled:pointer-events-none disabled:opacity-50',
								selected
									? 'text-amber-500'
									: 'text-muted-foreground/40'
							)}
						>
							<Star
								className={cn(
									'size-6',
									selected && 'fill-current'
								)}
								aria-hidden
							/>
						</button>
					)
				})}
			</div>
			{error ? (
				<p id={`${id}-error`} className='text-xs text-destructive'>
					{error}
				</p>
			) : null}
		</div>
	)
}
