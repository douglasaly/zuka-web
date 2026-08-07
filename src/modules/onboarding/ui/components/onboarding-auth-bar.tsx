'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserProfile } from '@/hooks/use-user-profile'
import { setViewAsBuyerMode } from '@/lib/auth/view-as-buyer'
import { cn } from '@/lib/utils'

function goToMarketplace() {
	setViewAsBuyerMode()
}

export function OnboardingAuthBar() {
	const { isAuthenticated, profile, isLoading } = useUserProfile()

	const displayName =
		[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
		profile?.email ||
		'Conta'

	return (
		<header className='sticky top-0 z-40 shrink-0 border-b border-border/60 bg-background/95 backdrop-blur-sm'>
			<div className='mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6'>
				{/* Brand + escape — one destination, clear label */}
				<div className='flex min-w-0 items-center gap-2 sm:gap-3'>
					<Link
						href='/'
						onClick={goToMarketplace}
						aria-label='Zuka — ir para o marketplace'
						className='shrink-0 font-heading text-xl font-extrabold tracking-tight text-foreground transition-opacity hover:opacity-80'
					>
						Zuka
					</Link>

					<span
						aria-hidden
						className='hidden h-4 w-px bg-border sm:block'
					/>

					<Link
						href='/'
						onClick={goToMarketplace}
						aria-label='Voltar ao marketplace'
						className={cn(
							buttonVariants({ variant: 'outline', size: 'sm' }),
							'h-9 gap-1.5 rounded-full border-border/80 px-3 text-sm font-medium text-foreground shadow-none hover:border-border hover:bg-muted/60'
						)}
					>
						<ArrowLeft className='size-3.5 shrink-0' aria-hidden />
						<span className='truncate'>
							<span className='sm:hidden'>Marketplace</span>
							<span className='hidden sm:inline'>
								Voltar ao marketplace
							</span>
						</span>
					</Link>
				</div>

				{/* Account */}
				{isLoading ? (
					<Skeleton className='h-9 w-24 rounded-full' />
				) : isAuthenticated ? (
					<Link
						href='/perfil'
						aria-label={`Abrir o teu perfil (${displayName})`}
						className={cn(
							buttonVariants({ variant: 'ghost', size: 'sm' }),
							'h-9 max-w-[140px] rounded-full px-3 sm:max-w-[180px]'
						)}
					>
						<span className='truncate text-sm font-medium'>
							{displayName}
						</span>
					</Link>
				) : (
					<div className='flex shrink-0 items-center gap-1.5'>
						<Link
							href='/auth/login'
							className={cn(
								buttonVariants({
									variant: 'ghost',
									size: 'sm',
								}),
								'h-9 rounded-full px-3'
							)}
						>
							Entrar
						</Link>
						<Link
							href='/signup'
							className={cn(
								buttonVariants({ size: 'sm' }),
								'h-9 rounded-full px-4'
							)}
						>
							Criar conta
						</Link>
					</div>
				)}
			</div>
		</header>
	)
}
