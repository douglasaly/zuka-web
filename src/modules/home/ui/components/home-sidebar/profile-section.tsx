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
	SidebarMenuSkeleton,
} from '@/components/ui/sidebar'
import { useUserProfile } from '@/hooks/use-user-profile'
import {
	getSellerPanelPath,
	isAwaitingSellerApproval,
	needsSellerOnboarding,
} from '@/lib/auth/routing'

export const DashboardSection = () => {
	const pathname = usePathname()
	const { profile, isAuthenticated, isSeller, isLoading } = useUserProfile()

	if (isLoading) {
		return (
			<SidebarGroup>
				<SidebarGroupLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground/70'>
					Conta
				</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						{Array.from({ length: 3 }).map((_, i) => (
							<SidebarMenuItem key={i}>
								<SidebarMenuSkeleton showIcon />
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		)
	}

	const sellerPath = getSellerPanelPath(profile)
	const continueOnboarding = isSeller && needsSellerOnboarding(profile)
	const awaitingApproval = isAwaitingSellerApproval(profile)

	const sellerLabel = awaitingApproval
		? 'Aguarda aprovação'
		: continueOnboarding
			? 'Continuar registo'
			: 'Painel do vendedor'

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
								tooltip={sellerLabel}
								isActive={
									pathname.startsWith('/dashboard/seller') ||
									pathname.startsWith('/onboarding/seller')
								}
								render={
									<Link prefetch href={sellerPath}>
										<Store className='size-4' />
										<span>{sellerLabel}</span>
									</Link>
								}
							/>
						</SidebarMenuItem>
					) : isAuthenticated ? (
						<SidebarMenuItem>
							<SidebarMenuButton
								tooltip='Abrir uma loja'
								isActive={pathname.startsWith(
									'/onboarding/seller'
								)}
								render={
									<Link
										prefetch
										href='/onboarding/seller'
									>
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
