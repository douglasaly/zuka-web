import { SellerLayout } from '@/modules/seller/ui/layouts/seller-layout'

interface PageLayout {
	children: React.ReactNode
}

const Layout = ({ children }: PageLayout) => {
	return <SellerLayout>{children}</SellerLayout>
}

export default Layout
