import { BaseLayout } from '@/modules/base/base-layout'

interface LayoutProps {
	children: React.ReactNode
}
export const dynamic = 'force-dynamic'

const Layout = ({ children }: LayoutProps) => {
	return <BaseLayout>{children}</BaseLayout>
}

export default Layout
