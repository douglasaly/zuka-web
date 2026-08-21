'use client'
import { useQuery } from '@tanstack/react-query'
import { Store } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { SellerStoreDetail } from '@/types'
import { StoreEditorForm } from '@/modules/seller/ui/components/store-editor/store-editor-form'
export const SellerStoreView = () => {
	const { data, isLoading, isError, error, refetch } = useQuery<{
		store: SellerStoreDetail
	}>({
		queryKey: ['seller-store'],
		queryFn: async () => {
			const res = await fetch('/api/seller/store')
			if (res.status === 404) {
				throw new Error('NO_STORE')
			}
			if (!res.ok) {
				const body = await res.json().catch(() => ({}))
				throw new Error(body.error ?? 'Failed to load store')
			}
			return res.json()
		},
	})
	if (isLoading) {
		return (
			<div className='min-w-0 space-y-6'>
				<div className='flex items-center justify-between gap-3'>
					<Skeleton className='h-5 w-48' />
					<Skeleton className='h-9 w-36 rounded-full' />
				</div>
				<Skeleton className='h-52 w-full rounded-2xl' />
				<div className='grid gap-6 xl:grid-cols-2'>
					<Skeleton className='h-64 w-full rounded-2xl' />
					<Skeleton className='h-64 w-full rounded-2xl' />
				</div>
			</div>
		)
	}
	if (isError && error.message === 'NO_STORE') {
		return (
			<div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-20 text-center'>
				<div className='flex size-14 items-center justify-center rounded-2xl bg-background shadow-sm ring-1 ring-border/60'>
					<Store className='size-7 text-muted-foreground' />
				</div>
				<h2 className='mt-5 font-heading text-xl font-bold tracking-tight'>
					Nenhuma loja encontrada
				</h2>
				<p className='mt-1.5 max-w-sm text-sm text-muted-foreground'>
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
	if (isError || !data?.store) {
		return (
			<div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-20 text-center'>
				<h2 className='font-heading text-xl font-bold tracking-tight'>
					Não foi possível carregar a loja
				</h2>
				<p className='mt-1.5 text-sm text-muted-foreground'>
					Tente novamente dentro de momentos.
				</p>
				<Button
					className='mt-6 rounded-full'
					variant='outline'
					onClick={() => refetch()}
				>
					Tentar novamente
				</Button>
			</div>
		)
	}
	return <StoreEditorForm store={data.store} />
}
