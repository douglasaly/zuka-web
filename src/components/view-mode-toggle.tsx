import { LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ViewMode = 'grid' | 'list'

type ViewModeToggleProps = {
	value: ViewMode
	onChange: (mode: ViewMode) => void
}

export const ViewModeToggle = ({ value, onChange }: ViewModeToggleProps) => (
	<div className='flex items-center gap-1'>
		<Button
			variant={value === 'grid' ? 'secondary' : 'ghost'}
			size='icon-sm'
			type='button'
			aria-label='Vista em grelha'
			aria-pressed={value === 'grid'}
			onClick={() => onChange('grid')}
		>
			<LayoutGrid className='size-4' />
		</Button>
		<Button
			variant={value === 'list' ? 'secondary' : 'ghost'}
			size='icon-sm'
			type='button'
			aria-label='Vista em lista'
			aria-pressed={value === 'list'}
			onClick={() => onChange('list')}
		>
			<List className='size-4' />
		</Button>
	</div>
)
