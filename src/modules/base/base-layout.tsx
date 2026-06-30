import { SidebarProvider } from '@/components/ui/sidebar'
import { HomeSidebar } from '../home/ui/components/home-sidebar'

export const dynamic = 'force-dynamic'

interface HomeLayoutProps {
	children: React.ReactNode
}

export const BaseLayout = ({ children }: HomeLayoutProps) => {
	return (
		<div className='flex min-h-screen w-full bg-background'>
			<SidebarProvider defaultOpen>
				<HomeSidebar />
				<div className='flex min-h-screen min-w-0 flex-1 flex-col'>
					<main className='flex-1 min-w-0'>{children}</main>
				</div>
			</SidebarProvider>
		</div>
	)
}
