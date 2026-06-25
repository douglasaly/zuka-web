import { OnboardingAuthBar } from '@/modules/onboarding/ui/components/onboarding-auth-bar'

export default function OnboardingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='flex min-h-screen flex-col bg-background'>
			<OnboardingAuthBar />
			{children}
		</div>
	)
}
