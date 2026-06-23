'use client'

import {
	HomeIcon,
	MessageSquare,
	Search,
	ShoppingBag,
	User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const items = [
	{ title: 'Início', url: '/', icon: HomeIcon },
	{
		title: 'Explorar',
		url: '/feed/explorar',
		icon: Search,
	},
	{
		title: 'Pedidios',
		url: '/feed/pedidos',
		icon: ShoppingBag,
	},
	{
		title: 'Mensagens',
		url: '/feed/messages',
		icon: MessageSquare,
	},
	{
		title: 'Perfil',
		url: '/perfil',
		icon: User,
	},
]

export const MainSection = () => {
	const pathname = usePathname()

	return (
		<main>
			<div className='p-4'>
				<Link href='/' className='font-bold text-3xl'>
					Zuka
				</Link>
			</div>
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
											className={cn(
												'flex items-center gap-4 text-muted-foreground',
												pathname === item.url &&
													'font-semibold'
											)}
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
