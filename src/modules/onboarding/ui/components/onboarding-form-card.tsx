import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface OnboardingFormCardProps {
	children: ReactNode
	className?: string
}

export function OnboardingFormCard({
	children,
	className,
}: OnboardingFormCardProps) {
	return (
		<div
			className={cn(
				'space-y-5 rounded-2xl border border-border/60 bg-card p-5 sm:p-6',
				className
			)}
		>
			{children}
		</div>
	)
}

interface OnboardingFieldProps {
	label: string
	hint?: string
	children: ReactNode
	className?: string
}

export function OnboardingField({
	label,
	hint,
	children,
	className,
}: OnboardingFieldProps) {
	return (
		<div className={cn('space-y-2', className)}>
			<div>
				<label className='text-sm font-semibold'>{label}</label>
				{hint && (
					<p className='mt-0.5 text-xs text-muted-foreground'>
						{hint}
					</p>
				)}
			</div>
			{children}
		</div>
	)
}

export const onboardingInputClass =
	'h-auto rounded-xl border-0 bg-muted px-3 py-2.5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/50'
