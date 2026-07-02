import type { Notification } from '@/types/notifications'

export function groupByDate(items: Notification[]) {
	const now = new Date()
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)
	const weekAgo = new Date(today)
	weekAgo.setDate(weekAgo.getDate() - 7)

	const buckets: Record<string, Notification[]> = {
		Hoje: [],
		Ontem: [],
		'Esta semana': [],
		Anteriores: [],
	}

	for (const n of items) {
		const d = new Date(n.createdAt)
		const day = new Date(d.getFullYear(), d.getMonth(), d.getDate())
		if (day >= today) buckets['Hoje'].push(n)
		else if (day >= yesterday) buckets['Ontem'].push(n)
		else if (day >= weekAgo) buckets['Esta semana'].push(n)
		else buckets['Anteriores'].push(n)
	}

	return Object.entries(buckets).filter(([, v]) => v.length > 0)
}
