'use client'

import { ShieldOff } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useUserProfile } from '@/hooks/use-user-profile'
import { setViewAsBuyerMode } from '@/lib/auth/view-as-buyer'

/**
 * Shown when a signed-in user opens an admin-only route without admin access.
 * Mobile-first: stacked full-width actions; sticky footer within thumb reach.
 */
export function ForbiddenView() {
	const { isAuthenticated, isLoading } = useUserProfile()

	return (
		<div className='flex min-h-dvh flex-col bg-background'>
			<header className='shrink-0 border-b border-border/60'>
				<div className='mx-auto flex h-14 w-full max-w-lg items-center px-4 sm:h-16 sm:px-6'>
					<Link
						href='/'
						onClick={() => setViewAsBuyerMode()}
						aria-label='Zuka — ir para o marketplace'
						className='font-heading text-xl font-extrabold tracking-tight'
					>
						Zuka
					</Link>
				</div>
			</header>

			<main
				id='main-content'
				className='mx-auto flex w-full max-w-lg flex-1 flex-col px-4 sm:px-6'
			>
				<div className='flex flex-1 flex-col items-center justify-center py-10 text-center sm:py-14'>
					<div
						className='flex size-16 items-center justify-center rounded-full bg-muted sm:size-20'
						aria-hidden
					>
						<ShieldOff className='size-8 text-muted-foreground sm:size-9' />
					</div>

					<p className='mt-6 text-sm font-medium text-muted-foreground'>
						Acesso negado
					</p>
					<h1 className='mt-2 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl'>
						Área restrita
					</h1>
					<p className='mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base'>
						Esta zona é só para a equipe Zuka. Se abriste este link
						por engano, podes voltar ao marketplace sem problemas.
					</p>
				</div>

				<div className='sticky bottom-0 -mx-4 border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur-sm sm:static sm:mx-0 sm:mb-14 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none'>
					<div className='flex flex-col gap-2'>
						<Button
							render={
								<Link
									href='/'
									onClick={() => setViewAsBuyerMode()}
								/>
							}
							className='h-12 w-full rounded-full text-base font-semibold'
							size='lg'
						>
							Ir para o marketplace
						</Button>
						{!isLoading && isAuthenticated ? (
							<Button
								render={<Link href='/log-out' />}
								variant='ghost'
								className='h-11 w-full rounded-full text-muted-foreground'
							>
								Sair e entrar com outra conta
							</Button>
						) : !isLoading ? (
							<Button
								render={<Link href='/auth/login?next=/admin' />}
								variant='ghost'
								className='h-11 w-full rounded-full text-muted-foreground'
							>
								Entrar como administrador
							</Button>
						) : null}
					</div>
				</div>
			</main>
		</div>
	)
}
