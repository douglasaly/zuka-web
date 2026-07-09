import dynamic from 'next/dynamic'

const SignupView = dynamic(
	() =>
		import('@/modules/signup/ui/views/signup-view').then(
			(m) => m.SignupView
		),
	{
		loading: () => (
			<div className='flex min-h-screen items-center justify-center'>
				<div className='size-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
			</div>
		),
	}
)

export default function SignupPage() {
	return <SignupView />
}
