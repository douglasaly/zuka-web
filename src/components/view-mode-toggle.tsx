import { LayoutGrid, List } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import type { ViewMode } from '@/types'
type ViewModeToggleProps = {
	value: ViewMode
	onChange: (mode: ViewMode) => void
}
export const ViewModeToggle = ({ value, onChange }: ViewModeToggleProps) => (
	<div className='flex items-center gap-1'>
		<IconTooltipButton
			label='Vista em grelha'
			variant={value === 'grid' ? 'secondary' : 'ghost'}
			aria-pressed={value === 'grid'}
			onClick={() => onChange('grid')}
		>
			<LayoutGrid className='size-4' />
		</IconTooltipButton>
		<IconTooltipButton
			label='Vista em lista'
			variant={value === 'list' ? 'secondary' : 'ghost'}
			aria-pressed={value === 'list'}
			onClick={() => onChange('list')}
		>
			<List className='size-4' />
		</IconTooltipButton>
	</div>
)
