import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/auth/admin'
import { getSessionUser } from '@/lib/auth/session'
import { AdminLayout } from '@/modules/admin/ui/layouts/admin-layout'

export default async function Layout({
	children,
}: {
	children: React.ReactNode
}) {
	const sessionUser = await getSessionUser()
	if (!sessionUser) {
		redirect('/auth/login?next=/admin')
	}

	const admin = await getAdminUser()
	if (!admin) {
		redirect('/area-restrita')
	}

	return <AdminLayout>{children}</AdminLayout>
}
