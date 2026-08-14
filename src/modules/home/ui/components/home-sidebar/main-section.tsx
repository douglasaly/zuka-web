'use client'

import {
	Compass,
	HomeIcon,
	MessageSquare,
	ShoppingBag,
	ShoppingCart,
	User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
} from '@/components/ui/sidebar'
import { useCartItemCount, useHasHydrated } from '@/hooks/use-cart'
import { useInbox } from '@/hooks/use-inbox'
import { useUserProfile } from '@/hooks/use-user-profile'
import { cn } from '@/lib/utils'

const publicItems = [
	{ title: 'Início', url: '/', icon: HomeIcon },
	{ title: 'Explorar', url: '/feed/explorar', icon: Compass },
	{ title: 'Carrinho', url: '/carrinho', icon: ShoppingCart },
]

const authItems = [
	{ title: 'Pedidos', url: '/feed/pedidos', icon: ShoppingBag },
	{ title: 'Mensagens', url: '/mensagens', icon: MessageSquare },
	{ title: 'Perfil', url: '/perfil', icon: User },
]

export const MainSection = () => {
	const pathname = usePathname()
	const { isAuthenticated, isLoading } = useUserProfile()
	const { unreadTotal } = useInbox()
	const hasHydrated = useHasHydrated()
	const cartCount = useCartItemCount()
	const visibleCartCount = hasHydrated ? cartCount : 0

	const items = [...publicItems, ...(isAuthenticated ? authItems : [])]

	if (isLoading) {
		return (
			<SidebarGroup>
				<SidebarGroupLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground/70'>
					Comprar
				</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						{Array.from({ length: 5 }).map((_, i) => (
							<SidebarMenuItem key={i}>
								<SidebarMenuSkeleton showIcon />
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		)
	}

	return (
		<SidebarGroup>
			<SidebarGroupLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground/70'>
				Comprar
			</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => {
						const isActive =
							item.url === '/'
								? pathname === '/'
								: pathname === item.url ||
									pathname.startsWith(`${item.url}/`)
						const isMessages = item.url === '/mensagens'
						const isCart = item.url === '/carrinho'
						const showUnread =
							isMessages && isAuthenticated && unreadTotal > 0
						const showCartBadge = isCart && visibleCartCount > 0
						const tooltip = showUnread
							? `Mensagens (${unreadTotal} por ler)`
							: showCartBadge
								? `Carrinho (${visibleCartCount} itens)`
								: item.title

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={tooltip}
									isActive={isActive}
									className={cn(
										(showUnread || showCartBadge) && 'pr-8',
										isMessages &&
											!isActive &&
											'text-foreground',
										showUnread &&
											!isActive &&
											'bg-secondary/8 font-medium hover:bg-secondary/12'
									)}
									render={
										<Link prefetch href={item.url}>
											<item.icon
												className={cn(
													'size-4',
													showUnread &&
														'text-secondary'
												)}
											/>
											<span>{item.title}</span>
										</Link>
									}
								/>
								{showUnread ? (
									<SidebarMenuBadge
										className='rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground peer-data-active/menu-button:bg-secondary peer-data-active/menu-button:text-secondary-foreground'
										aria-label={`${unreadTotal} mensagens por ler`}
									>
										{unreadTotal > 99 ? '99+' : unreadTotal}
									</SidebarMenuBadge>
								) : showCartBadge ? (
									<SidebarMenuBadge
										className='rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground peer-data-active/menu-button:bg-secondary peer-data-active/menu-button:text-secondary-foreground'
										aria-label={`${visibleCartCount} itens no carrinho`}
									>
										{visibleCartCount > 99
											? '99+'
											: visibleCartCount}
									</SidebarMenuBadge>
								) : null}
							</SidebarMenuItem>
						)
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
