import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface OnboardingFormCardProps {
	children: ReactNode
	className?: string
	title?: string
	description?: string
}

export function OnboardingFormCard({
	children,
	className,
	title,
	description,
}: OnboardingFormCardProps) {
	return (
		<div
			className={cn(
				'space-y-5 rounded-2xl border border-border/60 bg-card p-5 sm:p-6',
				className
			)}
		>
			{(title || description) && (
				<div className='space-y-1'>
					{title && (
						<p className='text-sm font-semibold text-foreground'>
							{title}
						</p>
					)}
					{description && (
						<p className='text-xs leading-relaxed text-muted-foreground sm:text-sm'>
							{description}
						</p>
					)}
				</div>
			)}
			{children}
		</div>
	)
}

interface OnboardingFieldProps {
	label: string
	hint?: string
	optional?: boolean
	error?: string | null
	children: ReactNode
	className?: string
}

export function OnboardingField({
	label,
	hint,
	optional,
	error,
	children,
	className,
}: OnboardingFieldProps) {
	return (
		<div className={cn('space-y-2', className)}>
			<div>
				<p className='text-sm font-semibold text-foreground'>
					{label}
					{optional ? (
						<span className='ml-1.5 font-normal text-muted-foreground'>
							(opcional)
						</span>
					) : null}
				</p>
				{hint && (
					<p className='mt-0.5 text-xs leading-relaxed text-muted-foreground'>
						{hint}
					</p>
				)}
			</div>
			{children}
			{error ? (
				<p role='alert' className='text-xs text-destructive'>
					{error}
				</p>
			) : null}
		</div>
	)
}

export const onboardingInputClass =
	'h-auto rounded-xl border-0 bg-muted px-3 py-2.5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/50'
