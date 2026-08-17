import { noIndexMetadata } from '@/lib/seo/metadata'
import { OnboardingAuthBar } from '@/modules/onboarding/ui/components/onboarding-auth-bar'

export const metadata = noIndexMetadata

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
