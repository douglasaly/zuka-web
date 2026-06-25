'use client'

import { ShoppingBag, Store } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
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
		description: 'Descobre produtos e lojas locais em Moçambique',
		icon: ShoppingBag,
		redirect: '/onboarding/welcome',
		iconClass: 'bg-orange-50 text-secondary',
	},
	{
		id: 'seller' as const,
		title: 'Tenho uma loja',
		description: 'Vende os teus produtos para milhares de clientes',
		icon: Store,
		redirect: '/onboarding/seller',
		iconClass: 'bg-emerald-50 text-emerald-700',
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
			<div className='flex flex-1 items-center justify-center text-sm text-muted-foreground'>
				A carregar...
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
			setError(err instanceof Error ? err.message : 'Erro ao continuar')
		} finally {
			setLoading(null)
		}
	}

	return (
		<div className='flex flex-1 flex-col items-center justify-center bg-background px-4 py-12'>
			<div className='w-full max-w-md space-y-8'>
				<div className='space-y-2 text-center'>
					<h1 className='font-heading text-4xl font-bold tracking-tight'>Zuka</h1>
					<p className='text-sm text-muted-foreground'>
						O mercado local de Moçambique
					</p>
				</div>

				<div className='space-y-2 text-center'>
					<h2 className='font-heading text-xl font-bold'>
						Como queres usar o Zuka?
					</h2>
					<p className='text-sm text-muted-foreground'>
						Escolhe como queres começar
					</p>
				</div>

				<div className='space-y-3'>
					{roles.map((role) => (
						<button
							key={role.id}
							type='button'
							disabled={loading != null}
							onClick={() => handleRoleSelect(role)}
							className='group w-full text-left'
						>
							<div className='flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200 hover:border-border disabled:opacity-60'>
								<div
									className={cn(
										'flex size-12 shrink-0 items-center justify-center rounded-xl',
										role.iconClass
									)}
								>
									<role.icon className='size-5' />
								</div>
								<div className='min-w-0 flex-1'>
									<p className='font-semibold text-foreground transition-colors group-hover:text-secondary'>
										{loading === role.id ? 'A configurar...' : role.title}
									</p>
									<p className='text-sm text-muted-foreground'>
										{role.description}
									</p>
								</div>
							</div>
						</button>
					))}
				</div>

				{error && (
					<p className='rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive'>
						{error}
					</p>
				)}

				<p className='text-center text-xs leading-relaxed text-muted-foreground'>
					Ao continuar aceitas os{' '}
					<Button
						render={<Link href='/termos' />}
						variant='link'
						className='h-auto p-0 text-xs font-semibold text-foreground'
					>
						Termos de Uso
					</Button>{' '}
					e a{' '}
					<Button
						render={<Link href='/privacidade' />}
						variant='link'
						className='h-auto p-0 text-xs font-semibold text-foreground'
					>
						Política de Privacidade
					</Button>
				</p>
			</div>
		</div>
	)
}
