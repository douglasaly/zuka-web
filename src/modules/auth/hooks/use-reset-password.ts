'use client'

import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase/firebase-client'

const ERROR_MESSAGES: Record<string, string> = {
	'auth/expired-action-code': 'O link expirou. Solicite um novo.',
	'auth/invalid-action-code': 'O link é inválido. Solicite um novo.',
	'auth/weak-password':
		'A palavra-passe é muito fraca. Escolha uma mais segura.',
}

export function useResetPassword() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const oobCode = searchParams.get('oobCode')
	const mode = searchParams.get('mode')

	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [validating, setValidating] = useState(true)
	const [codeValid, setCodeValid] = useState(false)

	useEffect(() => {
		async function validateCode() {
			if (mode !== 'resetPassword' || !oobCode) {
				setValidating(false)
				return
			}

			try {
				await verifyPasswordResetCode(auth, oobCode)
				setCodeValid(true)
			} catch {
				setError(
					'O link de redefinição é inválido ou expirou. Solicite um novo.'
				)
			} finally {
				setValidating(false)
			}
		}

		validateCode()
	}, [oobCode, mode])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		if (password.length < 6) {
			setError('A palavra-passe deve ter pelo menos 6 caracteres.')
			setLoading(false)
			return
		}

		if (password !== confirmPassword) {
			setError('As palavras-passe não coincidem.')
			setLoading(false)
			return
		}

		try {
			await confirmPasswordReset(auth, oobCode ?? '', password)
			router.push('/auth/login?reset=success')
		} catch (err: unknown) {
			const firebaseCode =
				err && typeof err === 'object' && 'code' in err
					? String((err as { code: string }).code)
					: ''

			setError(
				ERROR_MESSAGES[firebaseCode] ||
					'Ocorreu um erro ao redefinir a palavra-passe. Tente novamente.'
			)
		} finally {
			setLoading(false)
		}
	}

	return {
		password,
		setPassword,
		confirmPassword,
		setConfirmPassword,
		loading,
		error,
		validating,
		codeValid,
		handleSubmit,
	}
}
