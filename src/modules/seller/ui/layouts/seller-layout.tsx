import dynamic from 'next/dynamic'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SellerSidebarSkeleton } from '../components/seller-sidebar-skeleton'
import { SellerLayoutClient } from './seller-layout-client'
import { SellerTopBar } from './seller-top-bar'

const SellerSidebar = dynamic(
	() =>
		import('../components/seller-sidebar').then((m) => ({
			default: m.SellerSidebar,
		})),
	{ loading: () => <SellerSidebarSkeleton /> }
)

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
					<SellerLayoutClient />
					<main className='flex-1 min-w-0 overflow-y-auto p-6'>
						{children}
					</main>
				</div>
			</SidebarProvider>
		</div>
	)
}
