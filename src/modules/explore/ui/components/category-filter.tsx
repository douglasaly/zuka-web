import { cn } from '@/lib/utils'

export type CategoryOption = {
	value: string
	label: string
}

type CategoryFilterProps = {
	options: CategoryOption[]
	value: string
	onChange: (value: string) => void
}

export const CategoryFilter = ({
	options,
	value,
	onChange,
}: CategoryFilterProps) => (
	<div className='flex gap-2 overflow-x-auto pb-1 scrollbar-hide'>
		{options.map((cat) => (
			<button
				key={cat.value}
				type='button'
				onClick={() => onChange(cat.value)}
				className={cn(
					'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer',
					value === cat.value
						? 'border-primary bg-primary text-primary-foreground'
						: 'border-border/70 bg-background text-muted-foreground hover:border-secondary/30 hover:bg-secondary/5'
				)}
			>
				{cat.label}
			</button>
		))}
	</div>
)
