'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function SellerSettingsLoading() {
	return (
		<div className='min-w-0 max-w-6xl space-y-6'>
			<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
				<Skeleton className='h-4 w-56' />
				<Skeleton className='h-16 w-full rounded-2xl lg:max-w-md' />
			</div>
			<div className='grid gap-6 lg:grid-cols-2'>
				<div className='space-y-6'>
					<Skeleton className='h-44 w-full rounded-2xl' />
					<Skeleton className='h-36 w-full rounded-2xl' />
				</div>
				<div className='space-y-6'>
					<Skeleton className='h-44 w-full rounded-2xl' />
					<Skeleton className='h-28 w-full rounded-2xl' />
				</div>
			</div>
		</div>
	)
}

export function SellerSettingsUnauth() {
	return (
		<div className='flex min-w-0 max-w-6xl flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center'>
			<h2 className='font-heading text-lg font-bold tracking-tight'>
				Sessão necessária
			</h2>
			<p className='mt-1.5 max-w-sm text-sm text-muted-foreground'>
				Entre na sua conta para gerir as configurações da loja.
			</p>
			<Button
				className='mt-6 rounded-full'
				render={
					<Link href='/auth/login?next=/dashboard/seller/configuracoes'>
						Entrar
					</Link>
				}
			/>
		</div>
	)
}
