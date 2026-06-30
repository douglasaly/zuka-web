'use client'

import type { LucideIcon } from 'lucide-react'

export type SegmentedTabItem = {
	title: string
	icon: LucideIcon
}

type SegmentedTabsProps = {
	tabs: SegmentedTabItem[]
	value: string
	onChange: (value: string) => void
}

export const SegmentedTabs = ({
	tabs,
	value,
	onChange,
}: SegmentedTabsProps) => {
	return (
		<div
			role='tablist'
			className='inline-flex w-full rounded-md border border-border/40 bg-muted/40 p-1'
		>
			{tabs.map((t) => {
				const Icon = t.icon
				const isActive = value === t.title

				return (
					<button
						key={t.title}
						type='button'
						role='tab'
						aria-selected={isActive}
						onClick={() => onChange(t.title)}
						className={`flex flex-1 items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
							isActive
								? 'rounded-md bg-white text-foreground shadow'
								: 'text-muted-foreground hover:text-foreground'
						}`}
					>
						<Icon className='h-4 w-4' />
						{t.title}
					</button>
				)
			})}
		</div>
	)
}
