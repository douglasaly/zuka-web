import { STORE_FORM_MESSAGES } from '@/lib/validations/store-form'

function getErrorCode(error: unknown): string | null {
	if (error && typeof error === 'object' && 'code' in error) {
		return String(
			(
				error as {
					code: string
				}
			).code
		)
	}
	return null
}
export function friendlySignupError(error: unknown) {
	const code = getErrorCode(error)
	const msg = error instanceof Error ? error.message : String(error)
	if (
		code === 'auth/email-already-in-use' ||
		msg.includes('email-already-in-use')
	) {
		return 'Este email já está registado. Usa outro ou entra na tua conta.'
	}
	if (code === 'auth/weak-password' || msg.includes('weak-password')) {
		return STORE_FORM_MESSAGES.passwordMin
	}
	if (code === 'auth/invalid-email' || msg.includes('invalid-email')) {
		return 'Endereço de email inválido.'
	}
	if (
		code === 'auth/network-request-failed' ||
		msg.includes('network-request-failed')
	) {
		return 'Não foi possível contactar o servidor de autenticação. Verifica a ligação e tenta novamente.'
	}
	if (code === 'auth/too-many-requests') {
		return 'Demasiadas tentativas. Aguarda um momento e tenta novamente.'
	}
	if (
		msg.includes('Falha ao criar sessão') ||
		msg.includes('Validation failed')
	) {
		return 'Não foi possível concluir o registo. Verifica as credenciais Firebase no servidor e tenta novamente.'
	}
	return msg || 'Erro ao criar conta'
}
