import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserRoles } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'

export default async function DashboardPage() {
	const user = await getSessionUser()

	if (!user) {
		redirect('/auth/login?next=/dashboard')
	}

	const roles = await getUserRoles(user.id as string)

	if (roles.includes('seller')) {
		redirect('/dashboard/seller')
	}

	redirect('/feed/explorar')
}
