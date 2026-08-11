'use client'

import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { auth } from '@/lib/firebase/firebase-client'

export function useChangePassword() {
	const router = useRouter()
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [showCurrent, setShowCurrent] = useState(false)
	const [showNew, setShowNew] = useState(false)

	const passwordRequirements = [
		{ label: 'Pelo menos 6 caracteres', met: newPassword.length >= 6 },
		{
			label: 'As senhas coincidem',
			met: newPassword === confirmPassword && newPassword.length > 0,
		},
	]

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)

		if (newPassword.length < 6) {
			toast.error(
				'A nova palavra-passe deve ter pelo menos 6 caracteres.'
			)
			setLoading(false)
			return
		}

		if (newPassword !== confirmPassword) {
			toast.error('As novas palavras-passe não coincidem.')
			setLoading(false)
			return
		}

		try {
			const user = auth.currentUser

			if (!user || !user.email) {
				toast.error('Sessão expirada. Faça login novamente.')
				setLoading(false)
				return
			}

			const credential = EmailAuthProvider.credential(
				user.email,
				currentPassword
			)
			await reauthenticateWithCredential(user, credential)

			await updatePassword(user, newPassword)

			toast.success('Palavra-passe alterada com sucesso.')
			router.push('/perfil/definicoes')
		} catch (err: unknown) {
			const firebaseCode =
				err && typeof err === 'object' && 'code' in err
					? String((err as { code: string }).code)
					: ''

			const messages: Record<string, string> = {
				'auth/wrong-password': 'A senha atual está incorreta.',
				'auth/requires-recent-login':
					'Por segurança, faça login novamente antes de alterar a senha.',
				'auth/weak-password':
					'A nova senha é muito fraca. Escolha uma mais segura.',
				'auth/invalid-credential': 'A senha atual está incorreta.',
			}

			toast.error(
				messages[firebaseCode] ||
					'Erro ao alterar palavra-passe. Tente novamente.'
			)
		} finally {
			setLoading(false)
		}
	}

	return {
		router,
		currentPassword,
		setCurrentPassword,
		newPassword,
		setNewPassword,
		confirmPassword,
		setConfirmPassword,
		loading,
		showCurrent,
		setShowCurrent,
		showNew,
		setShowNew,
		passwordRequirements,
		handleSubmit,
	}
}
