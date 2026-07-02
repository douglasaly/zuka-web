'use client'

import { Heart, Menu, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useUserProfile } from '@/hooks/use-user-profile'
import { NotificationDropdown } from '@/modules/notifications/ui/components/notification-dropdown'
import { SearchInput } from './search-input'

function NavbarOrdersLink() {
	const { isAuthenticated, isLoading } = useUserProfile()

	if (isLoading || !isAuthenticated) return null

	return (
		<Button
			render={<Link href='/feed/pedidos' />}
			variant='ghost'
			size='icon-sm'
			aria-label='Pedidos'
		>
			<ShoppingBag className='size-4' />
		</Button>
	)
}
function NavbarAuth() {
	const { profile, isAuthenticated, isLoading } = useUserProfile()

	if (isLoading) {
		return (
			<Button
				size='sm'
				variant='ghost'
				disabled
				className='ml-1 rounded-full px-4'
			>
				...
			</Button>
		)
	}

	if (!isAuthenticated) {
		return (
			<>
				<Button
					size='sm'
					variant='ghost'
					className='hidden rounded-full sm:inline-flex'
					render={<Link href='/signup'>Registar</Link>}
				/>
				<Button
					size='sm'
					className='ml-1 rounded-full px-4'
					render={<Link href='/auth/login'>Entrar</Link>}
				/>
			</>
		)
	}

	const name =
		[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
		profile?.email ||
		'Conta'

	return (
		<Button
			render={<Link href='/perfil' />}
			size='sm'
			variant='outline'
			className='ml-1 max-w-40 rounded-full px-3'
		>
			<User className='size-4 shrink-0' />
			<span className='truncate'>{name}</span>
		</Button>
	)
}

export const HomeNavbar = () => {
	const router = useRouter()

	return (
		<header className='sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl py-1.5'>
			<div className='mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:px-6'>
				<div className='flex items-center gap-3 md:gap-4'>
					<SidebarTrigger
						nativeButton
						className='md:hidden'
						render={
							<Button
								variant='ghost'
								size='icon-sm'
								aria-label='Menu'
							>
								<Menu />
							</Button>
						}
					/>

					<Link
						prefetch
						href='/'
						className='flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80'
					>
						<div className='flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground'>
							Z
						</div>
						<span className='hidden font-heading text-xl font-bold tracking-tight sm:block'>
							Zuka
						</span>
					</Link>

					<div className='hidden min-w-0 flex-1 md:block'>
						<Suspense
							fallback={<div className='h-11 w-full max-w-xl' />}
						>
							<SearchInput />
						</Suspense>
					</div>

					<div className='ml-auto flex items-center gap-1'>
						<Button
							variant='ghost'
							size='icon-sm'
							type='button'
							aria-label='Favoritos'
							onClick={() => router.push('/perfil?tab=Guardados')}
						>
							<Heart className='size-4' />
						</Button>
						<NotificationDropdown />
						<NavbarOrdersLink />
						<NavbarAuth />
					</div>
				</div>

				<div className='md:hidden'>
					<Suspense fallback={<div className='h-11 w-full' />}>
						<SearchInput />
					</Suspense>
				</div>
			</div>
		</header>
	)
}
