'use client'

import { Search, Star, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import type { ReviewScope } from '../components/reviews/types'

type SellerReviewsToolbarProps = {
	scope: ReviewScope
	onScopeChange: (scope: ReviewScope) => void
	search: string
	onSearchChange: (value: string) => void
	needsReplyOnly: boolean
	onNeedsReplyChange: (value: boolean) => void
	resultLabel: string
}

export function SellerReviewsToolbar({
	scope,
	onScopeChange,
	search,
	onSearchChange,
	needsReplyOnly,
	onNeedsReplyChange,
	resultLabel,
}: SellerReviewsToolbarProps) {
	return (
		<div className='space-y-3'>
			<div
				className='flex gap-1.5'
				role='tablist'
				aria-label='Tipo de avaliação'
			>
				{(
					[
						{ value: 'store' as const, label: 'Loja' },
						{ value: 'product' as const, label: 'Produtos' },
					] as const
				).map((opt) => (
					<button
						key={opt.value}
						type='button'
						role='tab'
						aria-selected={scope === opt.value}
						onClick={() => onScopeChange(opt.value)}
						className={cn(
							'min-h-10 rounded-full px-4 text-sm font-medium transition-colors',
							scope === opt.value
								? 'bg-foreground text-background'
								: 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
						)}
					>
						{opt.label}
					</button>
				))}
			</div>

			<div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
				<div className='relative min-w-0 flex-1 sm:max-w-md'>
					<Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={
							scope === 'store'
								? 'Cliente, pedido ou comentário…'
								: 'Produto, cliente ou pedido…'
						}
						aria-label='Pesquisar avaliações'
						className='h-10 rounded-full pr-10 pl-9'
					/>
					{search ? (
						<span className='absolute top-1/2 right-1.5 -translate-y-1/2'>
							<IconTooltipButton
								label='Limpar pesquisa'
								className='size-8 text-muted-foreground'
								onClick={() => onSearchChange('')}
							>
								<X className='size-4' />
							</IconTooltipButton>
						</span>
					) : null}
				</div>

				{scope === 'store' ? (
					<button
						type='button'
						aria-pressed={needsReplyOnly}
						onClick={() => onNeedsReplyChange(!needsReplyOnly)}
						className={cn(
							'h-10 shrink-0 rounded-full px-4 text-sm font-medium transition-colors',
							needsReplyOnly
								? 'bg-foreground text-background'
								: 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
						)}
					>
						Por responder
					</button>
				) : null}
			</div>

			<p className='text-sm text-muted-foreground' aria-live='polite'>
				{resultLabel}
			</p>
		</div>
	)
}

export function SellerReviewsEmptyState() {
	return (
		<div className='flex w-full flex-col items-center rounded-2xl border border-border bg-card px-6 py-16 text-center sm:py-20'>
			<div className='flex size-14 items-center justify-center rounded-2xl bg-muted'>
				<Star className='size-7 text-muted-foreground' />
			</div>
			<h2 className='mt-5 font-heading text-xl font-bold tracking-tight'>
				Ainda não há avaliações
			</h2>
			<p className='mt-2 max-w-md text-sm leading-relaxed text-muted-foreground'>
				Quando um cliente avaliar um pedido entregue, a nota da loja e
				dos produtos aparece aqui.
			</p>
			<Button
				variant='outline'
				className='mt-6 rounded-full'
				render={<Link href='/dashboard/seller/pedidos' />}
			>
				Ver pedidos
			</Button>
		</div>
	)
}

export function SellerReviewsFilteredEmpty({
	onClear,
}: {
	onClear: () => void
}) {
	return (
		<div className='rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center'>
			<p className='text-sm text-muted-foreground'>
				Nenhuma avaliação corresponde aos filtros actuais.
			</p>
			<Button
				variant='ghost'
				size='sm'
				className='mt-3 rounded-full'
				onClick={onClear}
			>
				Limpar filtros
			</Button>
		</div>
	)
}

export function SellerReviewsErrorState({ onRetry }: { onRetry: () => void }) {
	return (
		<div className='flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center'>
			<h2 className='font-heading text-lg font-bold tracking-tight'>
				Não foi possível carregar as avaliações
			</h2>
			<p className='mt-1.5 max-w-md text-sm text-muted-foreground'>
				Verifique a ligação e tente outra vez. Se acabou de aplicar a
				migration, confirme que as tabelas existem.
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

export function ReviewsSkeleton() {
	return (
		<div className='space-y-5'>
			<div className='grid gap-4 sm:grid-cols-[14rem_1fr]'>
				<Skeleton className='h-24 rounded-2xl' />
				<Skeleton className='h-24 rounded-2xl' />
			</div>
			<Skeleton className='h-10 w-48 rounded-full' />
			{Array.from({ length: 3 }).map((_, i) => (
				<Skeleton key={i} className='h-36 w-full rounded-2xl' />
			))}
		</div>
	)
}
