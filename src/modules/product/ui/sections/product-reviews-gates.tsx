'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
export function ProductReviewsLoading() {
	return (
		<div
			className='mx-auto max-w-4xl space-y-5 px-4 pt-4 md:px-0'
			aria-busy='true'
			aria-label='A carregar avaliações'
		>
			<Skeleton className='h-5 w-36' />
			<div className='flex gap-4'>
				<Skeleton className='size-24 rounded-xl' />
				<div className='flex-1 space-y-2'>
					<Skeleton className='h-7 w-40' />
					<Skeleton className='h-4 w-full max-w-xs' />
					<Skeleton className='h-4 w-24' />
				</div>
			</div>
			<div className='grid gap-4 sm:grid-cols-[11rem_1fr]'>
				<Skeleton className='h-28 rounded-2xl' />
				<Skeleton className='h-28 rounded-2xl' />
			</div>
			{Array.from({ length: 3 }).map((_, i) => (
				<Skeleton key={i} className='h-36 w-full rounded-2xl' />
			))}
		</div>
	)
}
export function ProductReviewsError({ onRetry }: { onRetry: () => void }) {
	return (
		<div className='mx-auto flex min-h-[50vh] max-w-4xl flex-col items-center justify-center gap-4 px-4'>
			<h1 className='font-heading text-lg font-bold'>
				Não foi possível carregar as avaliações
			</h1>
			<p className='max-w-md text-center text-sm text-muted-foreground'>
				Verifica a ligação e tenta outra vez.
			</p>
			<Button
				variant='outline'
				className='rounded-full'
				onClick={onRetry}
			>
				Tentar novamente
			</Button>
		</div>
	)
}
export function ProductReviewsNotFound() {
	return (
		<div className='mx-auto flex min-h-[50vh] max-w-4xl flex-col items-center justify-center gap-4 px-4'>
			<p className='text-muted-foreground'>Produto não encontrado.</p>
			<Button
				variant='outline'
				className='rounded-full'
				render={<Link href='/feed/explorar' />}
			>
				Voltar a explorar
			</Button>
		</div>
	)
}
export function ProductReviewsEmpty({ productId }: { productId: string }) {
	return (
		<section className='rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center'>
			<h2 className='font-heading text-lg font-bold'>
				Ainda sem avaliações
			</h2>
			<p className='mx-auto mt-2 max-w-md text-sm text-muted-foreground'>
				Quando alguém comprar e avaliar, a nota do produto aparece aqui.
			</p>
			<Button
				variant='outline'
				className='mt-6 rounded-full'
				render={<Link href={`/product/${productId}`} />}
			>
				Voltar ao produto
			</Button>
		</section>
	)
}
