'use client'

import { cn } from '@/lib/utils'

interface SegmentedControlProps {
	options: { value: string; label: string }[]
	value: string
	onChange: (value: string) => void
	className?: string
}

export const SegmentedControl = ({
	options,
	value,
	onChange,
	className,
}: SegmentedControlProps) => {
	return (
		<div
			className={cn(
				'inline-flex w-full max-w-xs rounded-xl border border-border/40 bg-muted/40 p-1',
				className
			)}
		>
			{options.map((option) => (
				<button
					key={option.value}
					type='button'
					onClick={() => onChange(option.value)}
					className={cn(
						'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all',
						value === option.value
							? 'border border-border/60 bg-background text-foreground'
							: 'text-muted-foreground hover:text-foreground'
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	)
}
