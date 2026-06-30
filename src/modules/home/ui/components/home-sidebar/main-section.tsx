'use client'

import { Compass, HomeIcon, MessageSquare, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useUserProfile } from '@/hooks/use-user-profile'

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

	const items = [...publicItems, ...(isAuthenticated ? authItems : [])]

	if (isLoading) {
		return (
			<SidebarGroup>
				<SidebarGroupLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground/70'>
					Comprar
				</SidebarGroupLabel>
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

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={item.title}
									isActive={isActive}
									render={
										<Link prefetch href={item.url}>
											<item.icon className='size-4' />
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
	)
}
