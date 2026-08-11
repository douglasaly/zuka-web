'use client'

import {
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from 'firebase/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { fetchUserProfile } from '@/lib/api/marketplace'
import { getPostLoginPath } from '@/lib/auth/routing'
import { clearViewAsBuyerMode } from '@/lib/auth/view-as-buyer'
import { auth } from '@/lib/firebase/firebase-client'
import { syncUserToBackend } from '@/lib/firebase/sync-user-to-backend'

function logLogin(step: string, data?: Record<string, unknown>) {
	console.log(`[auth/login] ${step}`, data ?? '')
}

function logLoginError(step: string, err: unknown) {
	const firebaseCode =
		err && typeof err === 'object' && 'code' in err
			? String((err as { code: string }).code)
			: undefined

	console.error(`[auth/login] ${step}`, {
		code: firebaseCode,
		message: err instanceof Error ? err.message : String(err),
	})
}

export function useLogin() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const next = searchParams.get('next')

	const resetSuccess = searchParams.get('reset') === 'success'

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (resetSuccess) {
			toast.success(
				'Palavra-passe redefinida com sucesso. Já pode entrar com a sua nova senha.'
			)
		}
	}, [resetSuccess])

	async function createSession(idToken: string) {
		logLogin('createSession:start')
		const res = await fetch('/api/auth/session', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ token: idToken }),
		})

		logLogin('createSession:response', {
			ok: res.ok,
			status: res.status,
		})

		if (!res.ok) {
			const body = await res.json().catch(() => ({}))
			logLogin('createSession:failed', { body })
			throw new Error('Falha ao criar sessão')
		}
	}

	async function finishLogin(
		idToken: string,
		meta: { uid: string; method: 'email' | 'google' }
	) {
		logLogin('finishLogin:start', {
			uid: meta.uid,
			method: meta.method,
			next,
		})

		await createSession(idToken)

		logLogin('syncUser:start', { uid: meta.uid })
		await syncUserToBackend()
		logLogin('syncUser:done', { uid: meta.uid })

		const profile = await fetchUserProfile()
		clearViewAsBuyerMode()
		const path = getPostLoginPath(profile, next)
		logLogin('redirect', {
			path,
			roles: profile?.roles,
			hasProfile: Boolean(profile),
		})

		router.push(path)
	}

	async function handleEmailLogin(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			logLogin('email:start', { email })
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			)
			logLogin('email:firebase-ok', { uid: userCredential.user.uid })
			const token = await userCredential.user.getIdToken()
			await finishLogin(token, {
				uid: userCredential.user.uid,
				method: 'email',
			})
		} catch (err: unknown) {
			logLoginError('email:failed', err)
			setError(err instanceof Error ? err.message : 'Erro ao entrar')
		} finally {
			setLoading(false)
		}
	}

	async function handleGoogleLogin() {
		setLoading(true)
		setError(null)

		try {
			logLogin('google:start')
			const provider = new GoogleAuthProvider()
			const result = await signInWithPopup(auth, provider)
			logLogin('google:firebase-ok', { uid: result.user.uid })
			const token = await result.user.getIdToken()
			await finishLogin(token, {
				uid: result.user.uid,
				method: 'google',
			})
		} catch (err: unknown) {
			logLoginError('google:failed', err)
			setError(err instanceof Error ? err.message : 'Erro ao entrar')
		} finally {
			setLoading(false)
		}
	}

	return {
		email,
		setEmail,
		password,
		setPassword,
		loading,
		error,
		handleEmailLogin,
		handleGoogleLogin,
	}
}
