'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { OnboardingProgress } from './onboarding-progress'

interface OnboardingShellProps {
	title: string
	subtitle?: string
	currentStep?: number
	totalSteps?: number
	onBack?: () => void
	children: ReactNode
	footer?: ReactNode
	className?: string
	maxWidth?: 'sm' | 'md' | 'lg'
}

const maxWidthClass = {
	sm: 'max-w-md',
	md: 'max-w-xl',
	lg: 'max-w-2xl',
}

export function OnboardingShell({
	title,
	subtitle,
	currentStep,
	totalSteps = 4,
	onBack,
	children,
	footer,
	className,
	maxWidth = 'md',
}: OnboardingShellProps) {
	const router = useRouter()

	function handleBack() {
		if (onBack) {
			onBack()
			return
		}
		router.back()
	}

	return (
		<div className='flex flex-1 flex-col bg-background'>
			<div className='mx-auto flex w-full flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10'>
				<div className={cn('mx-auto w-full', maxWidthClass[maxWidth])}>
					<div className='mb-8 flex items-center justify-between'>
						<Button
							type='button'
							variant='ghost'
							size='icon'
							onClick={handleBack}
							className='rounded-full'
							aria-label='Voltar'
						>
							<ArrowLeft className='size-5' />
						</Button>

						{currentStep != null && (
							<OnboardingProgress
								currentStep={currentStep}
								totalSteps={totalSteps}
							/>
						)}

						<div className='size-9' aria-hidden />
					</div>

					<div className='mb-8 space-y-2'>
						<h1 className='font-heading text-2xl font-bold tracking-tight sm:text-3xl'>
							{title}
						</h1>
						{subtitle && (
							<p className='text-sm text-muted-foreground sm:text-base'>
								{subtitle}
							</p>
						)}
					</div>

					<div className={cn('flex-1 space-y-6', className)}>
						{children}
					</div>
				</div>
			</div>

			{footer && (
				<div className='sticky bottom-0 border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur-sm sm:px-6'>
					<div
						className={cn(
							'mx-auto w-full',
							maxWidthClass[maxWidth]
						)}
					>
						{footer}
					</div>
				</div>
			)}
		</div>
	)
}
