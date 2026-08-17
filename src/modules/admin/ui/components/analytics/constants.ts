export const ANALYTICS_RANGES = [
	{ label: '7 dias', days: 7 },
	{ label: '30 dias', days: 30 },
	{ label: '90 dias', days: 90 },
] as const
export type DayCount = {
	date: string
	count: number
}
