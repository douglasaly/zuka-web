'use client'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { STATUS_FILTERS } from '@/modules/admin/ui/components/products/constants'

type AdminProductsFiltersProps = {
	search: string
	onSearchChange: (value: string) => void
	status: string
	onStatusChange: (value: string) => void
	hasFilters: boolean
	onClearFilters: () => void
}
export function AdminProductsFilters({
	search,
	onSearchChange,
	status,
	onStatusChange,
	hasFilters,
	onClearFilters,
}: AdminProductsFiltersProps) {
	return (
		<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
			<div className='relative min-w-0 flex-1 sm:max-w-sm'>
				<Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
				<Input
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder='Pesquisar por nome…'
					className='pl-9 pr-9'
					aria-label='Pesquisar produtos'
				/>
				{search ? (
					<span className='absolute right-1.5 top-1/2 -translate-y-1/2'>
						<Tooltip>
							<TooltipTrigger
								render={
									<button
										type='button'
										aria-label='Limpar pesquisa'
										className='rounded-md p-1.5 text-muted-foreground hover:text-foreground'
										onClick={() => onSearchChange('')}
									>
										<X className='size-4' />
									</button>
								}
							/>
							<TooltipContent>Limpar pesquisa</TooltipContent>
						</Tooltip>
					</span>
				) : null}
			</div>

			<Select
				value={status}
				onValueChange={(v) => v && onStatusChange(v)}
			>
				<SelectTrigger className='w-full sm:w-44' size='default'>
					<SelectValue placeholder='Estado' />
				</SelectTrigger>
				<SelectContent>
					{STATUS_FILTERS.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{hasFilters ? (
				<Button
					type='button'
					variant='ghost'
					size='sm'
					className='self-start sm:self-auto'
					onClick={onClearFilters}
				>
					Limpar filtros
				</Button>
			) : null}
		</div>
	)
}
