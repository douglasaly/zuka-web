import { SidebarProvider } from '@/components/ui/sidebar'
import { HomeNavbar } from '../components/home-navbar'
import { HomeSidebar } from '../components/home-sidebar'

export const dynamic = 'force-dynamic'

interface HomeLayoutProps {
	children: React.ReactNode
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
	return (
		<div className='w-full flex'>
			<div className='border-r-[0.2px] border-r-gray-200'>
				<SidebarProvider>
					<div className='bg-black'>
						<div className='flex min-h-screen'>
							<HomeSidebar />
						</div>
					</div>
				</SidebarProvider>
			</div>

			<div className='min-h-screen w-full'>
				<div className='h-2 bg-black' />
				<div className='flex flex-col px-5'>
					<HomeNavbar />
					<main className='flex-1 overflow-y-auto'>{children}</main>
				</div>
			</div>
		</div>
	)
}

//
