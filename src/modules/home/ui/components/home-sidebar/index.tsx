import { Separator } from '@/components/ui/separator'
import { Sidebar, SidebarContent } from '@/components/ui/sidebar'
import { MainSection } from './main-section'
import { DashboardSection } from './profile-section'

export const HomeSidebar = () => {
	return (
		<Sidebar className=' z-40 border-none bg-zinc-50' collapsible='icon'>
			<SidebarContent className='bg-background'>
				<div className='h-screen'>
					<MainSection />
				</div>
				<Separator />
				<DashboardSection />
			</SidebarContent>
		</Sidebar>
	)
}
