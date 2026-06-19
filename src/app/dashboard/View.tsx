'use client'

import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { login } from '@/lib/api/auth/login'

export const View = () => {
	const loginFn = useMutation({
		mutationFn: login,
	})

	async function loginApp() {
		await loginFn.mutateAsync({ provider: 'google' })
	}

	return (
		<div>
			<Button onClick={loginApp}>login</Button>
		</div>
	)
}
