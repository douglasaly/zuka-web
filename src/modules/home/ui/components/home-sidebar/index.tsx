import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from '@/components/ui/sidebar'
import { MainSection } from './main-section'
import { DashboardSection } from './profile-section'

export const HomeSidebar = () => {
	return (
		<Sidebar
			className='border-r border-sidebar-border bg-sidebar'
			collapsible='icon'
		>
			<SidebarHeader className='border-b border-sidebar-border p-4 py-5'>
				<div className='flex items-center gap-2.5'>
					<div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-extrabold text-primary-foreground'>
						Z
					</div>
					<div className='flex min-w-0 flex-col group-data-[collapsible=icon]:hidden'>
						<span className='truncate font-heading text-base font-bold tracking-tight'>
							Zuka
						</span>
						<span className='truncate text-xs text-muted-foreground'>
							Marketplace
						</span>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent className='px-2 py-3'>
				<MainSection />
			</SidebarContent>

			<SidebarFooter className='border-t border-sidebar-border p-2'>
				<DashboardSection />
			</SidebarFooter>
		</Sidebar>
	)
}
