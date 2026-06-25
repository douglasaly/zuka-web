import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/session'

export async function requireSessionPage(nextPath: string) {
	const user = await getSessionUser()
	if (!user) {
		redirect(`/auth/login?next=${encodeURIComponent(nextPath)}`)
	}
	return user
}
