import Link from 'next/link'

export function SignupLoginPrompt() {
	return (
		<p className='text-center text-sm text-muted-foreground'>
			Já tens conta?{' '}
			<Link
				href='/auth/login'
				className='font-semibold text-foreground hover:underline'
			>
				Entrar
			</Link>
		</p>
	)
}
