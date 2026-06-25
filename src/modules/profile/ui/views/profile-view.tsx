'use client'

import { ArrowLeft, Package, ShoppingBag, Store } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { useUserProfile } from '@/hooks/use-user-profile'
import { formatPrice } from '@/utils/format-price'

export const ProfileView = () => {
	const router = useRouter()
	const { profile, isAuthenticated, isLoading, isSeller } = useUserProfile()

	if (isLoading) {
		return (
			<div className='mx-auto max-w-2xl px-4 py-12 text-center text-muted-foreground'>
				A carregar perfil...
			</div>
		)
	}

	if (!isAuthenticated || !profile) {
		return (
			<div className='mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center'>
				<p className='text-muted-foreground'>
					Entre na sua conta para ver o perfil.
				</p>
				<Button render={<Link href='/auth/login?next=/perfil'>Entrar</Link>} />
			</div>
		)
	}

	const displayName =
		[profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
		'Utilizador'

	return (
		<div className='mx-auto max-w-2xl px-4 py-8 md:py-12'>
			<h1 className='mb-6 font-heading text-2xl font-bold md:text-3xl'>
				O meu perfil
			</h1>

			<div className='space-y-4'>
				<div className='rounded-2xl border border-border/60 bg-card p-5'>
					<p className='text-lg font-semibold'>{displayName}</p>
					<p className='text-sm text-muted-foreground'>{profile.email}</p>
					<p className='mt-2 text-xs text-muted-foreground'>
						Perfil: {isSeller ? 'Comprador e vendedor' : 'Comprador'}
					</p>
				</div>

				<div className='grid gap-3 sm:grid-cols-2'>
					<Link
						href='/feed/pedidos'
						className='flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:bg-muted/30'
					>
						<ShoppingBag className='size-5 text-secondary' />
						<div>
							<p className='font-semibold'>Os meus pedidos</p>
							<p className='text-sm text-muted-foreground'>
								Acompanhe as suas compras
							</p>
						</div>
					</Link>

					{isSeller ? (
						<Link
							href='/dashboard/seller'
							className='flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:bg-muted/30'
						>
							<Store className='size-5 text-emerald-600' />
							<div>
								<p className='font-semibold'>Painel do vendedor</p>
								<p className='text-sm text-muted-foreground'>
									Gerir loja e produtos
								</p>
							</div>
						</Link>
					) : (
						<Link
							href='/onboarding'
							className='flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:bg-muted/30'
						>
							<Package className='size-5 text-emerald-600' />
							<div>
								<p className='font-semibold'>Abrir uma loja</p>
								<p className='text-sm text-muted-foreground'>
									Publicar produtos no marketplace
								</p>
							</div>
						</Link>
					)}
				</div>

				<div className='flex gap-2 pt-2'>
					<Button variant='outline' onClick={() => router.push('/feed/explorar')}>
						Explorar marketplace
					</Button>
					<Button variant='ghost' render={<Link href='/log-out' />}>
						Sair
					</Button>
				</div>
			</div>
		</div>
	)
}
