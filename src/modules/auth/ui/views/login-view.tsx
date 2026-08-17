'use client'
import { Suspense } from 'react'
import { useLogin } from '@/modules/auth/hooks/use-login'
import { LoginBrandHeader } from '../sections/login-brand-header'
import { LoginFormSection } from '../sections/login-form-section'

function LoginForm() {
	const l = useLogin()
	return (
		<div className='flex min-h-screen items-center justify-center bg-muted/25 px-4 py-12'>
			<div className='w-full max-w-md space-y-6'>
				<LoginBrandHeader />
				<LoginFormSection
					email={l.email}
					password={l.password}
					loading={l.loading}
					error={l.error}
					onEmailChange={l.setEmail}
					onPasswordChange={l.setPassword}
					onEmailLogin={l.handleEmailLogin}
					onGoogleLogin={l.handleGoogleLogin}
				/>
			</div>
		</div>
	)
}
export default function LoginView() {
	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	)
}
