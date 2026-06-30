import { SellerLayout } from '@/modules/seller/ui/layout/seller-layout'

interface PageLayout {
	children: React.ReactNode
}

const Layout = ({ children }: PageLayout) => {
	return <SellerLayout>{children}</SellerLayout>
}

export default Layout
