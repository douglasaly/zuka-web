'use client'

import { ANALYTICS_RANGES } from '@/modules/admin/ui/components/analytics/constants'

type AdminAnalyticsRangeProps = {
	days: number
	onDaysChange: (days: number) => void
}

export function AdminAnalyticsRange({
	days,
	onDaysChange,
}: AdminAnalyticsRangeProps) {
	return (
		<div className='flex gap-1'>
			{ANALYTICS_RANGES.map((r) => (
				<button
					key={r.days}
					type='button'
					onClick={() => onDaysChange(r.days)}
					className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${days === r.days ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}
				>
					{r.label}
				</button>
			))}
		</div>
	)
}
