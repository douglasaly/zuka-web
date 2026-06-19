'use client'

import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	updateProfile,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { auth } from '@/lib/firebase/firebase-client'
import { syncUserToBackend } from '@/lib/firebase/sync-user-to-backend'

export const RegisterView = () => {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleEmailRegister(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)

			// opcional: salva displayName no Firebase Auth
			if (name) {
				await updateProfile(userCredential.user, {
					displayName: name,
				})
			}

			await syncUserToBackend()

			router.push('/dashboard')
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	async function handleGoogleRegister() {
		setLoading(true)
		setError(null)

		try {
			const provider = new GoogleAuthProvider()

			await signInWithPopup(auth, provider)

			await syncUserToBackend()

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
				<h1 className='mb-6 text-2xl font-bold'>Criar conta</h1>

				{/* FORM EMAIL/SENHA */}
				<form onSubmit={handleEmailRegister} className='space-y-4'>
					<div>
						<label className='mb-1 block text-sm font-medium'>
							Nome
						</label>
						<input
							type='text'
							placeholder='Seu nome'
							value={name}
							onChange={(e) => setName(e.target.value)}
							className='w-full rounded border p-2'
							autoComplete='name'
						/>
					</div>

					<div>
						<label className='mb-1 block text-sm font-medium'>
							Email
						</label>
						<input
							type='email'
							placeholder='seu@email.com'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-full rounded border p-2'
							autoComplete='email'
						/>
					</div>

					<div>
						<label className='mb-1 block text-sm font-medium'>
							Senha
						</label>
						<input
							type='password'
							placeholder='••••••••'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full rounded border p-2'
							autoComplete='new-password'
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full rounded bg-green-600 p-2 text-white disabled:cursor-not-allowed disabled:opacity-50'
					>
						{loading ? 'Criando conta...' : 'Registrar'}
					</button>
				</form>

				{/* DIVISOR */}
				<div className='my-6 flex items-center gap-3'>
					<div className='h-px flex-1 bg-gray-200' />
					<span className='text-sm text-gray-400'>ou</span>
					<div className='h-px flex-1 bg-gray-200' />
				</div>

				{/* GOOGLE */}
				<button
					type='button'
					onClick={handleGoogleRegister}
					disabled={loading}
					className='w-full rounded border p-2 font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
				>
					Continuar com Google
				</button>

				{/* ERROR */}
				{error && (
					<p className='mt-4 rounded bg-red-50 p-2 text-sm text-red-500'>
						{error}
					</p>
				)}
			</div>
		</div>
	)
}
