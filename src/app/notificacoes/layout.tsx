import { noIndexMetadata } from '@/lib/seo/metadata'
import { BaseLayout } from '@/modules/base/base-layout'

export const metadata = noIndexMetadata
export const dynamic = 'force-dynamic'

interface LayoutProps {
	children: React.ReactNode
}
const Layout = ({ children }: LayoutProps) => {
	return <BaseLayout>{children}</BaseLayout>
}
export default Layout
