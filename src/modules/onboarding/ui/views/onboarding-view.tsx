'use client'

import { ChevronRight, ShoppingBag, Store } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserProfile } from '@/hooks/use-user-profile'
import { setOnboardingRole } from '@/lib/api/marketplace'
import { createAppSession } from '@/lib/firebase/create-session'
import { auth } from '@/lib/firebase/firebase-client'
import { syncUserToBackend } from '@/lib/firebase/sync-user-to-backend'
import { cn } from '@/lib/utils'

const roles = [
	{
		id: 'buyer' as const,
		title: 'Quero comprar',
		description: 'Explora produtos e contacta lojas locais.',
		icon: ShoppingBag,
		redirect: '/onboarding/welcome',
		iconClass: 'bg-secondary/10 text-secondary',
	},
	{
		id: 'seller' as const,
		title: 'Quero vender',
		description: 'Cria a tua loja e publica produtos no Zuka.',
		icon: Store,
		redirect: '/onboarding/seller',
		iconClass: 'bg-emerald-500/10 text-emerald-700',
	},
]

export const OnboardingView = () => {
	const router = useRouter()
	const { isLoading, isSeller } = useUserProfile()
	const [loading, setLoading] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!isLoading && isSeller) {
			router.replace('/onboarding/seller')
		}
	}, [isLoading, isSeller, router])

	if (isLoading || isSeller) {
		return (
			<div className='flex flex-1 flex-col items-center justify-center gap-4 px-4'>
				<Skeleton className='h-8 w-40' />
				<Skeleton className='h-4 w-56' />
				<div className='mt-4 w-full max-w-md space-y-3'>
					<Skeleton className='h-20 w-full rounded-2xl' />
					<Skeleton className='h-20 w-full rounded-2xl' />
				</div>
				<p className='sr-only'>A preparar o teu onboarding…</p>
			</div>
		)
	}

	async function handleRoleSelect(role: (typeof roles)[number]) {
		setLoading(role.id)
		setError(null)

		try {
			if (!auth.currentUser) {
				router.push('/auth/login?next=/onboarding')
				return
			}

			await createAppSession()
			await syncUserToBackend()
			await setOnboardingRole(role.id)
			router.push(role.redirect)
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Não foi possível continuar. Tenta outra vez.'
			)
		} finally {
			setLoading(null)
		}
	}

	return (
		<div className='flex flex-1 flex-col items-center justify-center bg-background px-4 py-10 sm:py-14'>
			<div className='w-full max-w-md space-y-8'>
				<div className='space-y-3 text-center'>
					<p className='text-sm font-medium text-muted-foreground'>
						Bem-vindo ao Zuka
					</p>
					<h1 className='font-heading text-3xl font-bold tracking-tight sm:text-4xl'>
						Como queres começar?
					</h1>
					<p className='mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base'>
						Podes comprar já e abrir uma loja mais tarde — ou
						configurar a loja agora.
					</p>
				</div>

				<div className='space-y-3'>
					{roles.map((role) => {
						const isBusy = loading === role.id
						const isDisabled = loading != null

						return (
							<button
								key={role.id}
								type='button'
								disabled={isDisabled}
								aria-busy={isBusy}
								onClick={() => handleRoleSelect(role)}
								className={cn(
									'group flex w-full items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 text-left transition-colors',
									'hover:border-foreground/20 hover:bg-muted/30',
									'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
									'disabled:pointer-events-none disabled:opacity-55'
								)}
							>
								<div
									className={cn(
										'flex size-12 shrink-0 items-center justify-center rounded-xl',
										role.iconClass
									)}
								>
									<role.icon
										className='size-5'
										aria-hidden
									/>
								</div>
								<div className='min-w-0 flex-1'>
									<p className='font-semibold text-foreground'>
										{isBusy
											? 'A continuar…'
											: role.title}
									</p>
									<p className='mt-0.5 text-sm leading-snug text-muted-foreground'>
										{role.description}
									</p>
								</div>
								<ChevronRight
									className='size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground'
									aria-hidden
								/>
							</button>
						)
					})}
				</div>

				{error && (
					<p
						role='alert'
						className='rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-2.5 text-center text-sm text-destructive'
					>
						{error}
					</p>
				)}

				<p className='text-center text-xs leading-relaxed text-muted-foreground'>
					Ao continuar, aceitas os{' '}
					<Button
						render={<Link href='/termos-e-condicoes' />}
						variant='link'
						className='h-auto p-0 text-xs font-semibold text-foreground underline-offset-2'
					>
						Termos de Uso
					</Button>{' '}
					e a{' '}
					<Button
						render={<Link href='/privacidade' />}
						variant='link'
						className='h-auto p-0 text-xs font-semibold text-foreground underline-offset-2'
					>
						Política de Privacidade
					</Button>
					.
				</p>
			</div>
		</div>
	)
}
