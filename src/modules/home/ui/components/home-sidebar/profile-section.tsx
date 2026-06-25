'use client'

import { LogIn, LogOut, Store, StoreIcon, UserPlus } from 'lucide-react'
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

export const DashboardSection = () => {
	const pathname = usePathname()
	const { isAuthenticated, isSeller, isLoading } = useUserProfile()

	if (isLoading) return null

	return (
		<SidebarGroup>
			<SidebarGroupLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground/70'>
				Conta
			</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{isSeller ? (
						<SidebarMenuItem>
							<SidebarMenuButton
								tooltip='Painel do vendedor'
								isActive={pathname.startsWith('/dashboard/seller')}
								render={
									<Link prefetch href='/dashboard/seller'>
										<Store className='size-4' />
										<span>Painel do vendedor</span>
									</Link>
								}
							/>
						</SidebarMenuItem>
					) : isAuthenticated ? (
						<SidebarMenuItem>
							<SidebarMenuButton
								tooltip='Abrir uma loja'
								isActive={pathname === '/onboarding'}
								render={
									<Link prefetch href='/onboarding'>
										<StoreIcon className='size-4' />
										<span>Abrir uma loja</span>
									</Link>
								}
							/>
						</SidebarMenuItem>
					) : (
						<>
							<SidebarMenuItem>
								<SidebarMenuButton
									tooltip='Entrar'
									isActive={pathname === '/auth/login'}
									render={
										<Link prefetch href='/auth/login'>
											<LogIn className='size-4' />
											<span>Entrar</span>
										</Link>
									}
								/>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									tooltip='Criar conta'
									isActive={pathname === '/auth/register'}
									render={
									<Link prefetch href='/signup'>
										<UserPlus className='size-4' />
										<span>Registar</span>
									</Link>
									}
								/>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									tooltip='Abrir uma loja'
									render={
									<Link prefetch href='/signup'>
										<StoreIcon className='size-4' />
										<span>Vender no Zuka</span>
									</Link>
									}
								/>
							</SidebarMenuItem>
						</>
					)}

					{isAuthenticated && (
						<SidebarMenuItem>
							<SidebarMenuButton
								tooltip='Sair'
								render={
									<Link prefetch href='/log-out'>
										<LogOut className='size-4' />
										<span>Sair</span>
									</Link>
								}
							/>
						</SidebarMenuItem>
					)}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
