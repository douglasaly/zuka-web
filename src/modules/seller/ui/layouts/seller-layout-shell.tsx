'use client'
import dynamic from 'next/dynamic'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SellerSidebarSkeleton } from '../components/seller-sidebar-skeleton'
import { SellerLayoutClient } from './seller-layout-client'
import { SellerPageMetaProvider } from './seller-page-meta'
import { SellerTopBar } from './seller-top-bar'

const SellerSidebar = dynamic(
	() =>
		import('../components/seller-sidebar').then((m) => ({
			default: m.SellerSidebar,
		})),
	{ loading: () => <SellerSidebarSkeleton /> }
)
interface SellerLayoutShellProps {
	children: React.ReactNode
}
export function SellerLayoutShell({ children }: SellerLayoutShellProps) {
	return (
		<div className='flex min-h-screen w-full bg-background'>
			<SidebarProvider defaultOpen>
				<SellerPageMetaProvider>
					<SellerSidebar />
					<div className='flex min-h-screen min-w-0 flex-1 flex-col'>
						<SellerTopBar />
						<SellerLayoutClient />
						<main className='min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6'>
							<div className='min-w-0 max-w-full'>{children}</div>
						</main>
					</div>
				</SellerPageMetaProvider>
			</SidebarProvider>
		</div>
	)
}
