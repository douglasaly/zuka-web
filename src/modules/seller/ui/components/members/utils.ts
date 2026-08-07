import type { MemberUser } from '@/modules/seller/ui/components/members/types'

export function displayName(user: MemberUser) {
	const name = [user.firstName, user.lastName]
		.filter(Boolean)
		.join(' ')
		.trim()
	return name || user.email || 'Utilizador'
}

export function initialsOf(user: MemberUser) {
	const parts = [user.firstName, user.lastName].filter(Boolean) as string[]
	if (parts.length > 0) {
		return parts
			.map((n) => n.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}
	return (user.email?.charAt(0) ?? '?').toUpperCase()
}

export function formatJoined(iso: string | null) {
	if (!iso) return 'Convite pendente'
	return `Desde ${new Date(iso).toLocaleDateString('pt-PT', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})}`
}
