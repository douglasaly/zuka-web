import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	type FilterValues,
	SearchFiltersSheet,
} from '@/modules/search/ui/components/search-filters-sheet'

type ExploreSearchBarProps = {
	value: string
	onChange: (value: string) => void
	filterValues: FilterValues
	handleApplyFilters: (values: FilterValues) => void
	handleClearFilters: () => void
}
export const ExploreSearchBar = ({
	value,
	onChange,
	filterValues,
	handleApplyFilters,
	handleClearFilters,
}: ExploreSearchBarProps) => (
	<div className='flex gap-2'>
		<div className='relative flex-1'>
			<Search className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
			<Input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder='Procurar produtos, lojas...'
				className='h-12 rounded-xl border border-border/60 bg-muted/30 pl-10 shadow-none'
			/>
		</div>
		<SearchFiltersSheet
			values={filterValues}
			onApply={handleApplyFilters}
			onClear={handleClearFilters}
			trigger={
				<Button
					variant='outline'
					size='icon'
					className='hidden size-12 shrink-0 rounded-xl md:flex'
					aria-label='Filtros'
				>
					<SlidersHorizontal className='size-4' />
				</Button>
			}
		/>
	</div>
)
