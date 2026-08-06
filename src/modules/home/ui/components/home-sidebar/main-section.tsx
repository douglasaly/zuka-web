'use client'

import {
	Compass,
	HomeIcon,
	MessageSquare,
	ShoppingBag,
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
import { useInbox } from '@/hooks/use-inbox'
import { useUserProfile } from '@/hooks/use-user-profile'
import { cn } from '@/lib/utils'

const publicItems = [
	{ title: 'Início', url: '/', icon: HomeIcon },
	{ title: 'Explorar', url: '/feed/explorar', icon: Compass },
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
						const showUnread =
							isMessages && isAuthenticated && unreadTotal > 0

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={
										showUnread
											? `Mensagens (${unreadTotal} por ler)`
											: item.title
									}
									isActive={isActive}
									className={cn(
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
										className='rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground'
										aria-label={`${unreadTotal} mensagens por ler`}
									>
										{unreadTotal > 99 ? '99+' : unreadTotal}
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
