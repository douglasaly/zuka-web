'use client'

import { Switch } from '@/components/ui/switch'
import { SettingsRow } from './settings-row'

type SettingsToggleRowProps = {
	title: string
	description?: string
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}

export const SettingsToggleRow = ({
	title,
	description,
	checked,
	onCheckedChange,
}: SettingsToggleRowProps) => (
	<SettingsRow
		title={title}
		description={description}
		right={
			<Switch
				checked={checked}
				onCheckedChange={onCheckedChange}
				aria-label={title}
			/>
		}
	/>
)
