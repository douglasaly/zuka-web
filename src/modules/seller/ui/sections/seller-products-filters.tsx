'use client'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { STATUS_OPTIONS } from '@/modules/seller/ui/components/products/constants'

type SellerProductsFiltersProps = {
	statusFilter: string
	onStatusChange: (value: string) => void
	search: string
	onSearchChange: (value: string) => void
	categoryFilter: string
	onCategoryChange: (value: string) => void
	categories: {
		id: string
		name: string
	}[]
	showPriceFilters: boolean
	onTogglePriceFilters: () => void
	minPrice: string
	maxPrice: string
	onMinPriceChange: (value: string) => void
	onMaxPriceChange: (value: string) => void
	hasFilters: boolean
	onClearFilters: () => void
}
export function SellerProductsFilters({
	statusFilter,
	onStatusChange,
	search,
	onSearchChange,
	categoryFilter,
	onCategoryChange,
	categories,
	showPriceFilters,
	onTogglePriceFilters,
	minPrice,
	maxPrice,
	onMinPriceChange,
	onMaxPriceChange,
	hasFilters,
	onClearFilters,
}: SellerProductsFiltersProps) {
	return (
		<>
			<div
				className='flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none'
				role='tablist'
				aria-label='Filtrar por estado'
			>
				{STATUS_OPTIONS.map((opt) => {
					const active = statusFilter === opt.value
					return (
						<button
							key={opt.value}
							type='button'
							role='tab'
							aria-selected={active}
							onClick={() => onStatusChange(opt.value)}
							className={cn(
								'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
								active
									? 'bg-foreground text-background'
									: 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
							)}
						>
							{opt.label}
						</button>
					)
				})}
			</div>

			<div className='flex flex-col gap-3'>
				<div className='flex flex-wrap items-center gap-2'>
					<div className='relative min-w-0 max-w-md flex-1 basis-full sm:basis-auto sm:min-w-48'>
						<Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							placeholder='Pesquisar por nome…'
							value={search}
							onChange={(e) => onSearchChange(e.target.value)}
							className='rounded-full pl-9 pr-9'
							aria-label='Pesquisar produtos'
						/>
						{search ? (
							<span className='absolute right-2 top-1/2 -translate-y-1/2'>
								<IconTooltipButton
									label='Limpar pesquisa'
									size='icon-sm'
									className='size-8 text-muted-foreground hover:text-foreground'
									onClick={() => onSearchChange('')}
								>
									<X className='size-4' />
								</IconTooltipButton>
							</span>
						) : null}
					</div>

					<Select
						value={categoryFilter}
						onValueChange={(v) => {
							if (!v) return
							onCategoryChange(v)
						}}
					>
						<SelectTrigger className='w-40 rounded-full'>
							<SelectValue placeholder='Categoria' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Todas</SelectItem>
							{categories.map((cat) => (
								<SelectItem key={cat.id} value={cat.id}>
									{cat.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button
						type='button'
						variant={showPriceFilters ? 'secondary' : 'outline'}
						size='sm'
						className='rounded-full'
						aria-expanded={showPriceFilters}
						onClick={onTogglePriceFilters}
					>
						<SlidersHorizontal className='size-3.5' />
						Preço
					</Button>

					{hasFilters ? (
						<Button
							type='button'
							variant='ghost'
							size='sm'
							className='rounded-full text-muted-foreground'
							onClick={onClearFilters}
						>
							Limpar
						</Button>
					) : null}
				</div>

				{showPriceFilters ? (
					<div className='flex flex-wrap items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2.5'>
						<span className='text-xs font-medium text-muted-foreground'>
							Intervalo (MZN)
						</span>
						<Input
							type='number'
							min={0}
							placeholder='Mín'
							value={minPrice}
							onChange={(e) => onMinPriceChange(e.target.value)}
							className='h-8 w-28 rounded-lg'
							aria-label='Preço mínimo'
						/>
						<span className='text-muted-foreground'>–</span>
						<Input
							type='number'
							min={0}
							placeholder='Máx'
							value={maxPrice}
							onChange={(e) => onMaxPriceChange(e.target.value)}
							className='h-8 w-28 rounded-lg'
							aria-label='Preço máximo'
						/>
					</div>
				) : null}
			</div>
		</>
	)
}
