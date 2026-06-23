import { SidebarProvider } from '@/components/ui/sidebar'
import { HomeSidebar } from '../home/ui/components/home-sidebar'

interface BaseLayoutProps {
	children: React.ReactNode
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
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

			<div className='min-h-screen w-full min-w-0'>
				<div className='h-2 bg-black' />
				<div className='flex flex-col px-5 min-w-0'>
					<main className='flex-1 min-w-0 overflow-y-auto'>
						{children}
					</main>
				</div>
				{/* <AppFooter /> */}
			</div>
		</div>
	)
}
