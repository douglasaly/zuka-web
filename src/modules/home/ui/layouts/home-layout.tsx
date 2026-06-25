import { AppFooter } from '@/components/app-footer'
import { SidebarProvider } from '@/components/ui/sidebar'
import { HomeNavbar } from '../components/home-navbar'
import { HomeSidebar } from '../components/home-sidebar'

export const dynamic = 'force-dynamic'

interface HomeLayoutProps {
	children: React.ReactNode
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
	return (
		<div className='flex min-h-screen w-full bg-background'>
			<SidebarProvider defaultOpen>
				<HomeSidebar />
				<div className='flex min-h-screen min-w-0 flex-1 flex-col'>
					<HomeNavbar />
					<main className='flex-1 min-w-0'>{children}</main>
					<AppFooter />
				</div>
			</SidebarProvider>
		</div>
	)
}
