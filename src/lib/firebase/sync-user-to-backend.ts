import { auth } from './firebase-client'

export async function syncUserToBackend() {
	const user = auth.currentUser
	if (!user) throw new Error('Usuário não autenticado')

	console.log('[auth/sync] syncing user', {
		uid: user.uid,
		email: user.email,
	})

	const token = await user.getIdToken()

	const res = await fetch('/api/auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ token }),
	})

	const data = await res.json()

	console.log('[auth/sync] response', {
		ok: res.ok,
		status: res.status,
		uid: user.uid,
	})

	if (!res.ok) {
		console.error('[auth/sync] failed', {
			uid: user.uid,
			error: data?.error,
		})
		throw new Error(data?.error || 'Erro ao sincronizar usuário')
	}

	return data
}
