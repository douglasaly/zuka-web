import { BaseLayout } from '@/modules/base/base-layout'

interface PageLayout {
	children: React.ReactNode
}

const Layout = ({ children }: PageLayout) => {
	return <BaseLayout>{children}</BaseLayout>
}

export default Layout
