'use client'

import {
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from 'firebase/auth'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/firebase/firebase-client'
import { createSession } from '@/utils/cookies'

export default function LoginPage() {
	const router = useRouter()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// 🔥 fluxo central
	const handlePostLogin = async (idToken: string) => {
		const res = await createSession(idToken)

		if (!res.success) {
			throw new Error(res.error || 'Erro session')
		}

		router.refresh()
		router.push('/dashboard')
	}

	// 🔐 EMAIL LOGIN
	const loginEmail = async () => {
		setLoading(true)
		setError(null)

		try {
			const result = await signInWithEmailAndPassword(
				auth,
				email,
				password
			)

			const token = await result.user.getIdToken()

			await handlePostLogin(token)
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	// 🌐 GOOGLE LOGIN
	const loginGoogle = async () => {
		setLoading(true)
		setError(null)

		try {
			const provider = new GoogleAuthProvider()

			const result = await signInWithPopup(auth, provider)

			const token = await result.user.getIdToken()

			await handlePostLogin(token)
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			style={{
				maxWidth: 420,
				margin: '0 auto',
				padding: 20,
			}}
		>
			<h1>Login</h1>

			{error && <p style={{ color: 'red' }}>{error}</p>}

			<input
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>

			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			<Button onClick={loginEmail} disabled={loading}>
				Login Email
			</Button>

			<hr />

			<Button onClick={loginGoogle} disabled={loading}>
				Login Google
			</Button>
		</div>
	)
}
