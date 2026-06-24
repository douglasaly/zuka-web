import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/auth/admin'
import { AdminLayout } from '@/modules/admin/ui/layouts/admin-layout'

export default async function Layout({ children }: { children: React.ReactNode }) {
	const user = await getAdminUser()
	if (!user) redirect('/')

	return <AdminLayout>{children}</AdminLayout>
}
