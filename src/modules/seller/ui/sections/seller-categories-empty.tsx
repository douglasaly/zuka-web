'use client'

import { FolderTree, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function SellerCategoriesSkeleton() {
	return (
		<div className='min-w-0 max-w-6xl space-y-5'>
			<div className='flex justify-between gap-3'>
				<div className='space-y-2'>
					<Skeleton className='h-4 w-48' />
					<Skeleton className='h-3 w-32' />
				</div>
				<Skeleton className='h-10 w-36 rounded-full' />
			</div>
			<div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]'>
				<Skeleton className='h-80 w-full rounded-2xl' />
				<Skeleton className='hidden h-72 w-full rounded-2xl lg:block' />
			</div>
		</div>
	)
}

export function SellerCategoriesError({ onRetry }: { onRetry: () => void }) {
	return (
		<div className='flex min-w-0 max-w-6xl flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center'>
			<h2 className='font-heading text-lg font-bold tracking-tight'>
				Não foi possível carregar as categorias
			</h2>
			<p className='mt-1.5 text-sm text-muted-foreground'>
				Tente novamente dentro de momentos.
			</p>
			<Button
				className='mt-6 rounded-full'
				variant='outline'
				onClick={onRetry}
			>
				Tentar novamente
			</Button>
		</div>
	)
}

export function SellerCategoriesEmpty({ onCreate }: { onCreate: () => void }) {
	return (
		<div className='relative overflow-hidden rounded-2xl border border-border/60 bg-card px-6 py-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:py-20'>
			<div className='pointer-events-none absolute inset-x-0 top-0 h-28 bg-muted/40' />
			<div className='relative mx-auto flex size-16 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm'>
				<FolderTree className='size-7' />
			</div>
			<h2 className='relative mt-6 font-heading text-2xl font-bold tracking-tight'>
				Ainda sem categorias
			</h2>
			<p className='relative mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground'>
				Crie grupos como Vestuário ou Electrónica para os clientes
				encontrarem produtos mais depressa.
			</p>
			<Button className='relative mt-7 rounded-full' onClick={onCreate}>
				<Plus className='size-4' />
				Criar primeira categoria
			</Button>
		</div>
	)
}
