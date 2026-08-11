'use client'

import { Switch } from '@/components/ui/switch'

type SettingsPrefRowProps = {
	id: string
	title: string
	description: string
	checked: boolean
	onCheckedChange: (v: boolean) => void
}

export function SettingsPrefRow({
	id,
	title,
	description,
	checked,
	onCheckedChange,
}: SettingsPrefRowProps) {
	return (
		<div className='flex min-w-0 items-center gap-3 px-3.5 py-3.5 sm:px-4'>
			<div className='min-w-0 flex-1'>
				<label
					htmlFor={id}
					className='cursor-pointer text-sm font-medium'
				>
					{title}
				</label>
				<p className='mt-0.5 text-xs leading-relaxed wrap-break-word text-muted-foreground'>
					{description}
				</p>
			</div>
			<Switch
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
				aria-describedby={`${id}-desc`}
			/>
			<span id={`${id}-desc`} className='sr-only'>
				{description}
			</span>
		</div>
	)
}
