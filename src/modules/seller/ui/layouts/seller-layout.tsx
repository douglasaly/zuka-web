import { SidebarProvider } from '@/components/ui/sidebar'
import { SellerSidebar } from '../components/seller-sidebar'
import { SellerTopBar } from './seller-top-bar'

interface SellerLayoutProps {
	children: React.ReactNode
}

export const SellerLayout = ({ children }: SellerLayoutProps) => {
	return (
		<div className='flex min-h-screen w-full bg-background'>
			<SidebarProvider defaultOpen>
				<SellerSidebar />
				<div className='flex min-h-screen min-w-0 flex-1 flex-col'>
					<SellerTopBar />
					<main className='flex-1 min-w-0 overflow-y-auto p-6'>
						{children}
					</main>
				</div>
			</SidebarProvider>
		</div>
	)
}
