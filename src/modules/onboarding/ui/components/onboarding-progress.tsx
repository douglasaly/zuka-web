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
			className={cn('flex items-center justify-center gap-2', className)}
			aria-label={`Passo ${currentStep} de ${totalSteps}`}
		>
			{Array.from({ length: totalSteps }, (_, index) => {
				const step = index + 1
				const isActive = step === currentStep

				return (
					<div
						key={step}
						className={cn(
							'h-2 rounded-full transition-all duration-300',
							isActive ? 'w-8 bg-foreground' : 'w-2 bg-border'
						)}
					/>
				)
			})}
		</div>
	)
}
