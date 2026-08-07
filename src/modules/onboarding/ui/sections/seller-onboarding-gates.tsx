'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

type SellerOnboardingGatesProps = {
	isUnauthenticated: boolean
	isLoading: boolean
	roleBootstrapError: string | null
	isPreparingSeller: boolean
	onRetryRoleBootstrap: () => void
}

export function SellerOnboardingGates({
	isUnauthenticated,
	isLoading,
	roleBootstrapError,
	isPreparingSeller,
	onRetryRoleBootstrap,
}: SellerOnboardingGatesProps) {
	if (isUnauthenticated) {
		return (
			<div className='flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center'>
				<p className='text-muted-foreground'>
					Precisas de entrar na tua conta para registar a tua loja.
				</p>
				<Button
					render={
						<Link href='/auth/login?next=/onboarding/seller'>
							Entrar
						</Link>
					}
				/>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className='flex flex-1 items-center justify-center text-sm text-muted-foreground'>
				A carregar...
			</div>
		)
	}

	if (roleBootstrapError) {
		return (
			<div className='flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center'>
				<p className='text-sm text-destructive'>{roleBootstrapError}</p>
				<Button type='button' onClick={onRetryRoleBootstrap}>
					Tentar novamente
				</Button>
			</div>
		)
	}

	if (isPreparingSeller) {
		return (
			<div className='flex flex-1 items-center justify-center text-sm text-muted-foreground'>
				A preparar a tua loja...
			</div>
		)
	}

	return null
}
