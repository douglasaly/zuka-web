'use client'

import {
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { auth } from '@/lib/firebase/firebase-client'

export default function LoginView() {
	const router = useRouter()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function createSession(idToken: string) {
		const res = await fetch('/api/auth/session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ token: idToken }),
		})

		if (!res.ok) {
			throw new Error('Falha ao criar sessão')
		}
	}

	async function fetchMe() {
		const res = await fetch('/api/auth/me', {
			credentials: 'include',
		})

		if (!res.ok) {
			throw new Error('Não foi possível carregar usuário')
		}

		return res.json()
	}

	async function handleEmailLogin(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			)

			const token = await userCredential.user.getIdToken()

			await createSession(token)

			await fetchMe()

			// 3. redireciona
			router.push('/dashboard')
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	async function handleGoogleLogin() {
		setLoading(true)
		setError(null)

		try {
			const provider = new GoogleAuthProvider()

			const result = await signInWithPopup(auth, provider)

			const token = await result.user.getIdToken()

			// 1. cria sessão
			await createSession(token)

			// 2. busca user
			await fetchMe()

			// 3. redireciona
			router.push('/dashboard')
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50'>
			<div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-md'>
				<h1 className='mb-6 text-2xl font-bold'>Entrar</h1>

				<form onSubmit={handleEmailLogin} className='space-y-4'>
					<input
						type='email'
						placeholder='Email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className='w-full rounded border p-2'
						autoComplete='email'
					/>

					<input
						type='password'
						placeholder='Senha'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='w-full rounded border p-2'
						autoComplete='current-password'
					/>

					<button
						type='submit'
						disabled={loading}
						className='w-full rounded bg-blue-600 p-2 text-white disabled:opacity-50'
					>
						{loading ? 'Entrando...' : 'Entrar'}
					</button>
				</form>

				<div className='my-6 flex items-center gap-3'>
					<div className='h-px flex-1 bg-gray-200' />
					<span className='text-sm text-gray-400'>ou</span>
					<div className='h-px flex-1 bg-gray-200' />
				</div>

				<button
					type='button'
					onClick={handleGoogleLogin}
					disabled={loading}
					className='w-full rounded border p-2 font-medium transition hover:bg-gray-50 disabled:opacity-50'
				>
					Continuar com Google
				</button>

				{error && (
					<p className='mt-4 rounded bg-red-50 p-2 text-sm text-red-500'>
						{error}
					</p>
				)}
			</div>
		</div>
	)
}
