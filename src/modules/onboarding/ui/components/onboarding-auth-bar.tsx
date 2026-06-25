'use client'

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { useUserProfile } from '@/hooks/use-user-profile'
import { cn } from '@/lib/utils'

export function OnboardingAuthBar() {
	const { isAuthenticated, profile, isLoading } = useUserProfile()

	const displayName =
		[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
		profile?.email ||
		'Conta'

	return (
		<header className='shrink-0 border-b border-border/60 bg-background/95 backdrop-blur-sm'>
			<div className='mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6'>
				<Link
					href='/'
					className='font-heading text-lg font-bold tracking-tight'
				>
					Zuka
				</Link>

				{isLoading ? (
					<div className='h-8 w-20' />
				) : isAuthenticated ? (
					<Link
						href='/perfil'
						className={cn(
							buttonVariants({ variant: 'outline', size: 'sm' }),
							'max-w-[160px] rounded-full px-3'
						)}
					>
						<span className='truncate'>{displayName}</span>
					</Link>
				) : (
					<div className='flex items-center gap-2'>
						<Link
							href='/auth/login'
							className={cn(
								buttonVariants({ variant: 'ghost', size: 'sm' }),
								'rounded-full'
							)}
						>
							Entrar
						</Link>
						<Link
							href='/signup'
							className={cn(
								buttonVariants({ size: 'sm' }),
								'rounded-full px-4'
							)}
						>
							Registar
						</Link>
					</div>
				)}
			</div>
		</header>
	)
}
