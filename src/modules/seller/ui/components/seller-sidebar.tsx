'use client'

import { LayoutGrid, LogOut, MessageSquare, Search, Store } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'

const NAV_ITEMS = [
	{ title: 'Dashboard', icon: LayoutGrid, href: '/dashboard/seller' },
	{
		title: 'Mensagens',
		icon: MessageSquare,
		href: '/dashboard/seller/mensagens',
	},
	{ title: 'Minha Loja', icon: Store, href: '/dashboard/seller/loja' },
	{ title: 'Explorar', icon: Search, href: '/dashboard/seller/explorar' },
]

const FOOTER_ITEMS = [
	{ title: 'Ver como comprador', icon: Store, href: '/feed/explorar' },
	{ title: 'Sair', icon: LogOut, href: '/log-out' },
]

export const SellerSidebar = () => {
	const pathname = usePathname()

	return (
		<Sidebar
			className='border-r border-sidebar-border bg-sidebar'
			collapsible='icon'
		>
			<SidebarHeader className='border-b border-sidebar-border p-4 py-5'>
				<div className='flex items-center gap-2.5'>
					<div className='flex min-w-0 group-data-[collapsible=icon]:hidden gap-1 items-center'>
						<h1 className='truncate font-heading text-3xl font-extrabold tracking-tight'>
							Zuka
						</h1>
						<span className='truncate text-xs text-muted-foreground rounded-xl border px-2 py-1'>
							vendedor
						</span>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent className='px-2 py-3'>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{NAV_ITEMS.map((item) => {
								const Icon = item.icon
								const isActive = pathname === item.href

								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											isActive={isActive}
											tooltip={item.title}
											render={
												<Link href={item.href}>
													<Icon className='size-4' />
													<span>{item.title}</span>
												</Link>
											}
										/>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className='border-t border-sidebar-border p-2'>
				<SidebarMenu>
					{FOOTER_ITEMS.map((item) => {
						const Icon = item.icon

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={item.title}
									render={
										<Link href={item.href}>
											<Icon className='size-4' />
											<span>{item.title}</span>
										</Link>
									}
								/>
							</SidebarMenuItem>
						)
					})}
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
