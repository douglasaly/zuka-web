'use client'
import { LogOut, Store } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'

const items = [
	{
		title: 'Painel do vendedor',
		url: '/dashboard/seller',
		icon: Store,
	},
	{ title: 'Sair', url: '/log-out', icon: LogOut },
]

export const DashboardSection = () => {
	const pathname = usePathname()

	return (
		<main>
			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						{items.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={item.title}
									render={
										<Link
											prefetch
											href={item.url}
											className='flex items-center
                     gap-4 text-muted-foreground'
										>
											<item.icon />
											<span className='text-sm'>
												{item.title}
											</span>
										</Link>
									}
									isActive={pathname === item.url}
								/>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</main>
	)
}
