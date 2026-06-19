import { auth } from "./firebase-client"

export async function syncUserToBackend() {
	const user = auth.currentUser
	if (!user) throw new Error('Usuário não autenticado')

	const token = await user.getIdToken()

	const res = await fetch('/api/auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ token }),
	})

	const data = await res.json()

	if (!res.ok) {
		throw new Error(data?.error || 'Erro ao sincronizar usuário')
	}

	return data
}
