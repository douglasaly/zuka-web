import { cn } from '@/lib/utils'

interface OnboardingProgressProps {
	currentStep: number
	totalSteps?: number
	className?: string
}

export function OnboardingProgress({
	currentStep,
	totalSteps = 4,
	className,
}: OnboardingProgressProps) {
	return (
		<div
			className={cn('flex items-center justify-center gap-1.5', className)}
			role='progressbar'
			aria-valuenow={currentStep}
			aria-valuemin={1}
			aria-valuemax={totalSteps}
			aria-label={`Passo ${currentStep} de ${totalSteps}`}
		>
			{Array.from({ length: totalSteps }, (_, index) => {
				const step = index + 1
				const isComplete = step < currentStep
				const isActive = step === currentStep

				return (
					<div
						key={step}
						className={cn(
							'h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out',
							isActive && 'w-7 bg-foreground',
							isComplete && 'w-3 bg-foreground/45',
							!isActive && !isComplete && 'w-1.5 bg-border'
						)}
					/>
				)
			})}
		</div>
	)
}
