'use client'

import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import { useResetPassword } from '../../hooks/use-reset-password'
import { ResetPasswordFormSection } from '../sections/reset-password-form-section'
import { ResetPasswordInvalidSection } from '../sections/reset-password-invalid-section'

function ResetForm() {
	const {
		password,
		setPassword,
		confirmPassword,
		setConfirmPassword,
		loading,
		error,
		validating,
		codeValid,
		handleSubmit,
	} = useResetPassword()

	if (validating) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-muted/25 px-4 py-12'>
				<Loader2 className='size-6 animate-spin text-muted-foreground' />
			</div>
		)
	}

	if (!codeValid) {
		return <ResetPasswordInvalidSection error={error} />
	}

	return (
		<ResetPasswordFormSection
			password={password}
			onPasswordChange={setPassword}
			confirmPassword={confirmPassword}
			onConfirmPasswordChange={setConfirmPassword}
			loading={loading}
			error={error}
			onSubmit={handleSubmit}
		/>
	)
}

export const ResetPasswordFormView = () => (
	<Suspense>
		<ResetForm />
	</Suspense>
)
