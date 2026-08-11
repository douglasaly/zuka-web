'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function SellerAnalyticsSkeleton() {
	return (
		// biome-ignore lint/a11y/useAriaPropsSupportedByRole: preserve original loading announcement markup
		<div
			className='space-y-4'
			aria-busy='true'
			aria-label='A carregar desempenho'
		>
			<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className='rounded-2xl border border-border/60 bg-card p-5'
					>
						<Skeleton className='mb-2 h-4 w-24' />
						<Skeleton className='h-8 w-28' />
						<Skeleton className='mt-2 h-3 w-32' />
					</div>
				))}
			</div>
			<Skeleton className='h-48 w-full rounded-2xl' />
		</div>
	)
}

type SellerAnalyticsErrorProps = {
	onRetry: () => void
}

export function SellerAnalyticsError({ onRetry }: SellerAnalyticsErrorProps) {
	return (
		<div className='flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center'>
			<h2 className='font-heading text-lg font-bold'>
				Não foi possível carregar o desempenho
			</h2>
			<p className='mt-1.5 max-w-md text-sm text-muted-foreground'>
				Verifica a ligação e tenta outra vez.
			</p>
			<button
				type='button'
				onClick={onRetry}
				className='mt-6 h-10 rounded-full bg-foreground px-4 text-sm font-medium text-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
			>
				Tentar novamente
			</button>
		</div>
	)
}
