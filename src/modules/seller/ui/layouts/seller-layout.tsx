import { SellerAccessGate } from './seller-access-gate'
import { SellerLayoutShell } from './seller-layout-shell'

interface SellerLayoutProps {
	children: React.ReactNode
}

export const SellerLayout = ({ children }: SellerLayoutProps) => {
	return (
		<SellerLayoutShell>
			<SellerAccessGate>{children}</SellerAccessGate>
		</SellerLayoutShell>
	)
}
