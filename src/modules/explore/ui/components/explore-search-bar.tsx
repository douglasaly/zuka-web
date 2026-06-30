import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ExploreSearchBarProps = {
	value: string
	onChange: (value: string) => void
	onFilter: () => void
}

export const ExploreSearchBar = ({
	value,
	onChange,
	onFilter,
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
		<Button
			variant='outline'
			size='icon-lg'
			type='button'
			aria-label='Filtros'
			onClick={onFilter}
			className='h-12 shrink-0 rounded-xl border-border/60'
		>
			<SlidersHorizontal className='size-4' />
		</Button>
	</div>
)
