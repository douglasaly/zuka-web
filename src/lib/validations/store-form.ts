/** Prefixos móveis Moçambique (sem código de país). */
const MZ_MOBILE = /^(82|83|84|85|86|87|88)\d{7}$/

const BLOCKED_EMAIL_DOMAINS = new Set([
	'example.com',
	'example.org',
	'example.net',
	'example.edu',
	'test.com',
	'test.org',
	'demo.com',
	'demo.org',
	'localhost',
	'invalid',
	'local',
])

const BLOCKED_EMAIL_LABELS = new Set(['example', 'demo', 'test', 'localhost'])

export const STORE_FORM_MESSAGES = {
	phoneInvalid:
		'Número inválido. Use o formato +258 seguido de 9 dígitos, começando por 82 a 88 (ex: +258841234567)',
	passwordMin: 'A palavra-passe deve ter no mínimo 8 caracteres',
	passwordMismatch: 'As palavras-passe não coincidem',
	deliveryContactRequired:
		'Preencha pelo menos um número de contacto (WhatsApp ou chamadas) para entregas',
	descriptionMin: 'A descrição deve ter no mínimo 20 caracteres',
	emailInvalid: 'E-mail inválido',
	emailPlaceholder:
		'Usa um e-mail real. Domínios como example ou demo não são permitidos.',
} as const

/** Strip non-digits; drop leading country code 258 if present. */
export function normalizeMzDigits(raw: string): string {
	let digits = raw.replace(/\D/g, '')
	if (digits.startsWith('258') && digits.length > 9) {
		digits = digits.slice(3)
	}
	return digits.slice(0, 9)
}

export function isValidMzMobile(raw: string): boolean {
	const digits = normalizeMzDigits(raw)
	return MZ_MOBILE.test(digits)
}

/** E.164 without spaces, e.g. +258821234567. Empty if invalid/empty. */
export function toE164Mz(raw: string): string {
	const digits = normalizeMzDigits(raw)
	if (!digits) return ''
	if (!MZ_MOBILE.test(digits)) return ''
	return `+258${digits}`
}

/** Display groups for the local part: "82 123 4567". */
export function formatMzMobileDisplay(raw: string): string {
	const digits = normalizeMzDigits(raw)
	const a = digits.slice(0, 2)
	const b = digits.slice(2, 5)
	const c = digits.slice(5, 9)
	return [a, b, c].filter(Boolean).join(' ')
}

export function isAllowedStoreEmail(email: string): boolean {
	const trimmed = email.trim().toLowerCase()
	const at = trimmed.lastIndexOf('@')
	if (at < 1) return false
	const domain = trimmed.slice(at + 1)
	if (!domain) return false
	if (BLOCKED_EMAIL_DOMAINS.has(domain)) return false
	const firstLabel = domain.split('.')[0]
	if (BLOCKED_EMAIL_LABELS.has(firstLabel)) return false
	return true
}

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidStoreEmail(email: string): boolean {
	const trimmed = email.trim()
	if (!EMAIL_FORMAT.test(trimmed)) return false
	return isAllowedStoreEmail(trimmed)
}
