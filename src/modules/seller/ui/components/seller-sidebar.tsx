'use client'

import {
	BarChart3,
	LayoutGrid,
	LogOut,
	MessageSquare,
	Package,
	Settings,
	ShoppingBag,
	Star,
	Store,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useUnreadCounts } from '@/hooks/use-unread-counts'
import { cn } from '@/lib/utils'

const GROUPS = [
	{
		label: 'Principal',
		items: [
			{
				title: 'Dashboard',
				icon: LayoutGrid,
				href: '/dashboard/seller',
			},
			{
				title: 'Pedidos',
				icon: ShoppingBag,
				href: '/dashboard/seller/pedidos',
				badgeKey: 'pendingOrders' as const,
			},
			{
				title: 'Mensagens',
				icon: MessageSquare,
				href: '/dashboard/seller/mensagens',
				badgeKey: 'unreadMessages' as const,
			},
		],
	},
	{
		label: 'Loja',
		items: [
			{
				title: 'Produtos',
				icon: Package,
				href: '/dashboard/seller/produtos',
			},
			{
				title: 'Minha Loja',
				icon: Store,
				href: '/dashboard/seller/loja',
			},
			{
				title: 'Avaliações',
				icon: Star,
				href: '/dashboard/seller/avaliacoes',
			},
		],
	},
	{
		label: 'Análises',
		items: [
			{
				title: 'Analytics',
				icon: BarChart3,
				href: '/dashboard/seller/analytics',
			},
		],
	},
	{
		label: 'Configurações',
		items: [
			{
				title: 'Configurações',
				icon: Settings,
				href: '/dashboard/seller/configuracoes',
			},
			{
				title: 'Membros',
				icon: Store,
				href: '/dashboard/seller/loja/membros',
			},
		],
	},
]

const FOOTER_ITEMS = [
	{ title: 'Ver como comprador', icon: Store, href: '/feed/explorar' },
	{ title: 'Sair', icon: LogOut, href: '/log-out' },
]

export const SellerSidebar = () => {
	const pathname = usePathname()
	const { data: unread } = useUnreadCounts()

	return (
		<Sidebar
			className='border-r border-sidebar-border bg-sidebar'
			collapsible='icon'
		>
			<SidebarHeader className='border-b border-sidebar-border p-4 py-4.5'>
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
				{GROUPS.map((group) => (
					<SidebarGroup key={group.label}>
						<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => {
									const Icon = item.icon
									const isActive =
										pathname === item.href ||
										pathname.startsWith(`${item.href}/`)

									const badgeCount =
										item.badgeKey && unread
											? unread[item.badgeKey]
											: 0

									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												isActive={isActive}
												tooltip={item.title}
												render={
													<Link href={item.href}>
														<Icon className='size-4' />
														<span>
															{item.title}
														</span>
													</Link>
												}
											/>
											{badgeCount > 0 && (
												<span
													className={cn(
														'absolute right-2 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground',
														'group-data-[collapsible=icon]:relative group-data-[collapsible=icon]:right-auto group-data-[collapsible=icon]:top-auto group-data-[collapsible=icon]:translate-y-0 group-data-[collapsible=icon]:mt-1'
													)}
												>
													{badgeCount > 99
														? '99+'
														: badgeCount}
												</span>
											)}
										</SidebarMenuItem>
									)
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
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
