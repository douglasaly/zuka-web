import { api } from '@/lib/axios'

interface LoginProps {
	provider: 'google' | 'emailAndPassword'
}

interface LoginResponse {
	status: string | null
}

export const login = async ({ provider }: LoginProps) => {
	if (provider === 'google') {
		const res = await fetch('/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!res.ok) {
			throw new Error('Login failed')
		}

		const data = await res.json()

		return data
	}
}
