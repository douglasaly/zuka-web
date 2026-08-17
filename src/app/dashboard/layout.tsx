import { noIndexMetadata } from '@/lib/seo/metadata'
import { SellerLayout } from '@/modules/seller/ui/layouts/seller-layout'

export const metadata = noIndexMetadata

interface PageLayout {
	children: React.ReactNode
}
const Layout = ({ children }: PageLayout) => {
	return <SellerLayout>{children}</SellerLayout>
}
export default Layout
