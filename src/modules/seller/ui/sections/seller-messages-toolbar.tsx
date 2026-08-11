'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { SellerMessagesFilter } from '../../hooks/use-seller-messages'

type SellerMessagesToolbarProps = {
	query: string
	onQueryChange: (value: string) => void
	filter: SellerMessagesFilter
	onFilterChange: (filter: SellerMessagesFilter) => void
	unreadCount: number
}

export function SellerMessagesToolbar({
	query,
	onQueryChange,
	filter,
	onFilterChange,
	unreadCount,
}: SellerMessagesToolbarProps) {
	return (
		<div className='flex min-w-0 flex-col gap-2 border-b border-border/60 p-3 sm:flex-row sm:items-center sm:p-4'>
			<div className='relative min-w-0 flex-1'>
				<Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
				<Input
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
					placeholder='Pesquisar…'
					className='h-11 rounded-full pl-9 text-base sm:h-10 sm:text-sm'
					aria-label='Pesquisar conversas'
				/>
			</div>
			{/* biome-ignore lint/a11y/useSemanticElements: pill filter row, not a form fieldset */}
			<div
				className='flex shrink-0 gap-1.5'
				role='group'
				aria-label='Filtrar conversas'
			>
				{(
					[
						{ value: 'all', label: 'Todas' },
						{ value: 'unread', label: 'Não lidas' },
					] as const
				).map((opt) => (
					<button
						key={opt.value}
						type='button'
						onClick={() => onFilterChange(opt.value)}
						aria-pressed={filter === opt.value}
						className={cn(
							'min-h-11 rounded-full px-3.5 text-xs font-medium transition-colors sm:min-h-9',
							filter === opt.value
								? 'bg-foreground text-background'
								: 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
						)}
					>
						{opt.label}
						{opt.value === 'unread' && unreadCount > 0
							? ` (${unreadCount})`
							: ''}
					</button>
				))}
			</div>
		</div>
	)
}
