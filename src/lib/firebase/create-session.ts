import { auth } from '@/lib/firebase/firebase-client'

export async function createAppSession() {
	const user = auth.currentUser
	if (!user) throw new Error('Usuário não autenticado')

	const token = await user.getIdToken()

	const res = await fetch('/api/auth/session', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ token }),
	})

	if (!res.ok) {
		throw new Error('Falha ao criar sessão')
	}
}
