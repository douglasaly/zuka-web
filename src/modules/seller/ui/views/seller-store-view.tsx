'use client'

import { useQuery } from '@tanstack/react-query'
import { Store } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { UserProfile } from '@/types/marketplace'

export const SellerStoreView = () => {
	const { data: profile, isLoading } = useQuery<UserProfile | null>({
		queryKey: ['user-profile'],
		queryFn: async () => {
			const res = await fetch('/api/me/profile')
			if (res.status === 401) return null
			if (!res.ok) throw new Error('Failed to load profile')
			const json = await res.json()
			return json.profile as UserProfile
		},
	})

	if (isLoading) {
		return (
			<div className='space-y-4'>
				<Skeleton className='h-40 w-full rounded-xl' />
				<Skeleton className='h-8 w-48' />
				<Skeleton className='h-24 w-full rounded-xl' />
			</div>
		)
	}

	const store = profile?.stores?.[0]

	if (!store) {
		return (
			<div className='flex flex-col items-center justify-center py-24 text-center'>
				<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
					<Store className='size-8 text-muted-foreground' />
				</div>
				<h2 className='mt-4 font-heading text-xl font-bold'>
					Nenhuma loja encontrada
				</h2>
				<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
					Complete o registo de vendedor para criar a sua loja.
				</p>
				<Button
					className='mt-6 rounded-full'
					render={
						<Link href='/onboarding/seller'>Ir para o registo</Link>
					}
				/>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='rounded-xl border border-border/60 bg-card p-6'>
				<div className='flex items-start justify-between'>
					<div>
						<p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
							Loja
						</p>
						<h1 className='mt-1 font-heading text-2xl font-bold'>
							{store.name}
						</h1>
						{store.status && (
							<span className='mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary'>
								{store.status === 'active'
									? 'Activa'
									: store.status === 'pending'
										? 'Pendente'
										: store.status === 'suspended'
											? 'Suspensa'
											: store.status}
							</span>
						)}
					</div>
					<Button
						variant='outline'
						size='sm'
						className='rounded-full'
					>
						Editar loja
					</Button>
				</div>

				<div className='mt-6 grid gap-4 sm:grid-cols-2'>
					<div className='rounded-lg bg-muted/50 p-4'>
						<p className='text-xs text-muted-foreground'>Slug</p>
						<p className='mt-0.5 font-mono text-sm'>
							/{store.slug}
						</p>
					</div>
					<div className='rounded-lg bg-muted/50 p-4'>
						<p className='text-xs text-muted-foreground'>
							Produtos
						</p>
						<p className='mt-0.5 text-sm font-medium'>
							{store.productCount}
						</p>
					</div>
				</div>
			</div>

			<div className='rounded-xl border border-border/60 bg-card p-6'>
				<h2 className='font-heading text-lg font-bold'>
					Configurações da loja
				</h2>
				<p className='mt-1 text-sm text-muted-foreground'>
					Em breve poderá editar o perfil da sua loja, banner,
					logótipo, WhatsApp e zonas de entrega.
				</p>
			</div>
		</div>
	)
}
