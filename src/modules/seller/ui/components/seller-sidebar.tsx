'use client'

import {
	LayoutGrid,
	LogOut,
	MessageSquare,
	Package,
	Settings,
	ShoppingBag,
	Star,
	Store,
	Users,
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
import type { StorePermission } from '@/lib/auth/store-permissions'
import { setViewAsBuyerMode } from '@/lib/auth/view-as-buyer'
import { cn } from '@/lib/utils'
import { useSellerAccess } from '@/modules/seller/hooks/use-seller-access'

type NavItem = {
	title: string
	icon: typeof LayoutGrid
	href: string
	badgeKey?: 'pendingOrders' | 'unreadMessages'
	/** If set, item is hidden when the member lacks this permission */
	permission?: StorePermission
}

const GROUPS: Array<{ label: string; items: NavItem[] }> = [
	{
		label: 'Principal',
		items: [
			{
				title: 'Dashboard',
				icon: LayoutGrid,
				href: '/dashboard/seller',
				permission: 'store.read',
			},
			{
				title: 'Pedidos',
				icon: ShoppingBag,
				href: '/dashboard/seller/pedidos',
				badgeKey: 'pendingOrders',
				permission: 'order.read',
			},
			{
				title: 'Mensagens',
				icon: MessageSquare,
				href: '/dashboard/seller/mensagens',
				badgeKey: 'unreadMessages',
				permission: 'message.read',
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
				permission: 'product.read',
			},
			{
				title: 'Minha Loja',
				icon: Store,
				href: '/dashboard/seller/loja',
				permission: 'store.read',
			},
			{
				title: 'Avaliações',
				icon: Star,
				href: '/dashboard/seller/avaliacoes',
				permission: 'review.read',
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
				icon: Users,
				href: '/dashboard/seller/loja/membros',
				permission: 'member.read',
			},
		],
	},
]

const FOOTER_ITEMS = [
	{ title: 'Ver como comprador', icon: Store, href: '/feed/explorar' },
	{ title: 'Sair', icon: LogOut, href: '/log-out' },
]

const ALL_NAV_HREFS = GROUPS.flatMap((group) =>
	group.items.map((item) => item.href)
)

/** Exact path, or longest nav href that is a parent of the current path. */
function resolveActiveHref(pathname: string): string | null {
	const matches = ALL_NAV_HREFS.filter(
		(href) => pathname === href || pathname.startsWith(`${href}/`)
	)
	if (matches.length === 0) return null
	return matches.reduce((best, href) =>
		href.length > best.length ? href : best
	)
}

export const SellerSidebar = () => {
	const pathname = usePathname()
	const { data: unread } = useUnreadCounts()
	const { can, isLoading } = useSellerAccess()
	const activeHref = resolveActiveHref(pathname)

	return (
		<Sidebar
			className='border-r border-sidebar-border bg-sidebar'
			collapsible='icon'
		>
			<SidebarHeader className='flex h-19 items-center border-b border-sidebar-border px-4'>
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
				{GROUPS.map((group) => {
					const items = group.items.filter((item) => {
						if (!item.permission) return true
						// While loading access, keep links visible to avoid flicker
						if (isLoading) return true
						return can(item.permission)
					})
					if (items.length === 0) return null

					return (
						<SidebarGroup key={group.label}>
							<SidebarGroupLabel>
								{group.label.toUpperCase()}
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{items.map((item) => {
										const Icon = item.icon
										const isActive =
											activeHref === item.href

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
					)
				})}
			</SidebarContent>

			<SidebarFooter className='border-t border-sidebar-border p-2'>
				<SidebarMenu>
					{FOOTER_ITEMS.map((item) => {
						const Icon = item.icon
						const isViewAsBuyer = item.href === '/feed/explorar'

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={item.title}
									render={
										<Link
											href={item.href}
											onClick={
												isViewAsBuyer
													? () => setViewAsBuyerMode()
													: undefined
											}
										>
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
