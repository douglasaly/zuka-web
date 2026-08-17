'use client'
import {
	Bell,
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
import { useNotifications } from '@/hooks/use-notifications'
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
	{ title: 'Notificações', url: '/notificacoes', icon: Bell },
	{ title: 'Perfil', url: '/perfil', icon: User },
]
type SidebarBadge = {
	count: number
	aria: string
	hint: string
	emphasise: boolean
}
const badge = (
	count: number,
	aria: string,
	hint: string,
	emphasise = true
): SidebarBadge | undefined =>
	count > 0 ? { count, aria, hint, emphasise } : undefined
export const MainSection = () => {
	const pathname = usePathname()
	const { isAuthenticated, isLoading } = useUserProfile()
	const { unreadTotal } = useInbox()
	const { unreadCount } = useNotifications()
	const hasHydrated = useHasHydrated()
	const cartCount = useCartItemCount()
	const visibleCartCount = hasHydrated ? cartCount : 0
	const items = [...publicItems, ...(isAuthenticated ? authItems : [])]
	const badges: Record<string, SidebarBadge | undefined> = {
		'/carrinho': badge(
			visibleCartCount,
			`${visibleCartCount} itens no carrinho`,
			`${visibleCartCount} ${visibleCartCount === 1 ? 'item' : 'itens'}`,
			false
		),
		'/mensagens': isAuthenticated
			? badge(
					unreadTotal,
					`${unreadTotal} mensagens por ler`,
					`${unreadTotal} por ler`
				)
			: undefined,
		'/notificacoes': isAuthenticated
			? badge(
					unreadCount,
					`${unreadCount} notificações por ler`,
					`${unreadCount} por ler`
				)
			: undefined,
	}
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
						const itemBadge = badges[item.url]
						const isPending = Boolean(itemBadge?.emphasise)
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={
										itemBadge
											? `${item.title} (${itemBadge.hint})`
											: item.title
									}
									isActive={isActive}
									className={cn(
										itemBadge && 'pr-8',
										isPending &&
											!isActive &&
											'bg-secondary/8 font-medium text-foreground hover:bg-secondary/12'
									)}
									render={
										<Link prefetch href={item.url}>
											<item.icon
												className={cn(
													'size-4',
													isPending &&
														!isActive &&
														'text-secondary'
												)}
											/>
											<span>{item.title}</span>
										</Link>
									}
								/>
								{itemBadge ? (
									<SidebarMenuBadge
										className='rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground peer-data-active/menu-button:bg-secondary peer-data-active/menu-button:text-secondary-foreground'
										aria-label={itemBadge.aria}
									>
										{itemBadge.count > 99
											? '99+'
											: itemBadge.count}
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
