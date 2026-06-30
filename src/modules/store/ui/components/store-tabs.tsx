'use client'

import { cn } from '@/lib/utils'

export const STORE_TABS = [
	{ value: 'products', label: 'Produtos' },
	{ value: 'about', label: 'Sobre' },
	{ value: 'reviews', label: 'Avaliações' },
] as const

type StoreTabsProps = {
	value: string
	onChange: (value: string) => void
}

export const StoreTabs = ({ value, onChange }: StoreTabsProps) => (
	<div role='tablist' className='mt-6 flex gap-6 border-b border-border/60'>
		{STORE_TABS.map((tab) => {
			const isActive = value === tab.value

			return (
				<button
					key={tab.value}
					type='button'
					role='tab'
					aria-selected={isActive}
					onClick={() => onChange(tab.value)}
					className={cn(
						'pb-3 text-sm font-medium transition-colors',
						isActive
							? 'border-b-2 border-primary text-foreground'
							: 'text-muted-foreground hover:text-foreground'
					)}
				>
					{tab.label}
				</button>
			)
		})}
	</div>
)
