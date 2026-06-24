import { getSessionUser } from '@/lib/auth/session'
import { getUserRoles, hasAdminAccess } from '@/lib/auth/roles'

export async function getAdminUser() {
	const user = await getSessionUser()
	if (!user) return null

	const userId = (user as Record<string, unknown>).id as string
	if (!userId) return null

	const roles = await getUserRoles(userId)
	if (!hasAdminAccess(roles)) return null

	return user
}

export async function requireAdminUser() {
	const user = await getAdminUser()
	if (!user) throw new Response('Forbidden', { status: 403 })
	return user
}
