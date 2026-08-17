'use client'
import { Search, X } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { ProductReviewSort } from '../components/reviews/types'

type ProductReviewsToolbarProps = {
	search: string
	onSearchChange: (value: string) => void
	sort: ProductReviewSort
	onSortChange: (sort: ProductReviewSort) => void
	activeRating: number | null
	onClearRating: () => void
	resultLabel: string
}
const SORT_OPTIONS: {
	value: ProductReviewSort
	label: string
}[] = [
	{ value: 'recent', label: 'Mais recentes' },
	{ value: 'highest', label: 'Maior nota' },
	{ value: 'lowest', label: 'Menor nota' },
]
export function ProductReviewsToolbar({
	search,
	onSearchChange,
	sort,
	onSortChange,
	activeRating,
	onClearRating,
	resultLabel,
}: ProductReviewsToolbarProps) {
	return (
		<div className='space-y-3'>
			<div className='relative'>
				<Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
				<Input
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder='Pesquisar nos comentários…'
					aria-label='Pesquisar avaliações'
					className='h-11 rounded-full pr-10 pl-9'
				/>
				{search ? (
					<IconTooltipButton
						label='Limpar pesquisa'
						className='absolute top-1/2 right-2 size-9 -translate-y-1/2 text-muted-foreground'
						onClick={() => onSearchChange('')}
					>
						<X className='size-4' />
					</IconTooltipButton>
				) : null}
			</div>

			<div
				className='flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none'
				role='group'
				aria-label='Ordenar avaliações'
			>
				{SORT_OPTIONS.map((opt) => (
					<button
						key={opt.value}
						type='button'
						aria-pressed={sort === opt.value}
						onClick={() => onSortChange(opt.value)}
						className={cn(
							'h-11 shrink-0 rounded-full px-3.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
							sort === opt.value
								? 'bg-foreground text-background'
								: 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
						)}
					>
						{opt.label}
					</button>
				))}
			</div>

			{activeRating != null ? (
				<div className='flex flex-wrap items-center gap-2'>
					<span className='text-sm text-muted-foreground'>
						Filtro:
					</span>
					<button
						type='button'
						onClick={onClearRating}
						className='inline-flex h-9 items-center gap-1.5 rounded-full bg-muted px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring'
						aria-label={`Remover filtro de ${activeRating} estrelas`}
					>
						{activeRating} estrelas
						<X className='size-3.5' aria-hidden />
					</button>
				</div>
			) : null}

			<p className='text-sm text-muted-foreground' aria-live='polite'>
				{resultLabel}
			</p>
		</div>
	)
}
