import { BaseLayout } from '@/modules/base/base-layout'

interface ProductsLayout {
	children: React.ReactNode
}

const Layout = ({ children }: ProductsLayout) => {
	return <BaseLayout>{children}</BaseLayout>
}

export default Layout
