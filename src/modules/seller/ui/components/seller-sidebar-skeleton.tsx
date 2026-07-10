import { Skeleton } from '@/components/ui/skeleton'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuSkeleton,
} from '@/components/ui/sidebar'

const GROUPS = [
	{ label: 'Principal', items: 3 },
	{ label: 'Loja', items: 3 },
	{ label: 'Análises', items: 1 },
	{ label: 'Configurações', items: 2 },
]

export const SellerSidebarSkeleton = () => {
	return (
		<Sidebar
			className='border-r border-sidebar-border bg-sidebar'
			collapsible='icon'
		>
			<SidebarHeader className='border-b border-sidebar-border p-4 py-5'>
				<div className='flex items-center gap-2.5'>
					<div className='flex min-w-0 group-data-[collapsible=icon]:hidden gap-1 items-center'>
						<Skeleton className='h-8 w-20' />
						<Skeleton className='h-5 w-16 rounded-full' />
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent className='px-2 py-3'>
				{GROUPS.map((group) => (
					<SidebarGroup key={group.label}>
						<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{Array.from({ length: group.items }).map(
									(_, i) => (
										<SidebarMenuSkeleton key={i} showIcon />
									)
								)}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter className='border-t border-sidebar-border p-2'>
				<SidebarMenu>
					<SidebarMenuSkeleton showIcon />
					<SidebarMenuSkeleton showIcon />
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
