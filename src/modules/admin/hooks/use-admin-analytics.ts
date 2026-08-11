'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { DayCount } from '@/modules/admin/ui/components/analytics/constants'
import { formatDay } from '@/modules/admin/ui/components/format-day'

async function fetchAnalytics(days: number) {
	const res = await fetch(`/api/admin/analytics?days=${days}`, {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function fetchStats() {
	const res = await fetch('/api/admin/stats', { credentials: 'include' })
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

export function useAdminAnalytics() {
	const [days, setDays] = useState(30)

	const { data: stats, isLoading: statsLoading } = useQuery({
		queryKey: ['admin-stats'],
		queryFn: fetchStats,
	})
	const { data, isLoading } = useQuery({
		queryKey: ['admin-analytics', days],
		queryFn: () => fetchAnalytics(days),
	})

	const signups = ((data?.signupsByDay ?? []) as DayCount[]).map((d) => ({
		...d,
		date: formatDay(d.date),
	}))
	const products = ((data?.productsByDay ?? []) as DayCount[]).map((d) => ({
		...d,
		date: formatDay(d.date),
	}))
	const stores = ((data?.storesByDay ?? []) as DayCount[]).map((d) => ({
		...d,
		date: formatDay(d.date),
	}))
	const topStores: Record<string, unknown>[] = data?.topStores ?? []

	return {
		days,
		setDays,
		stats,
		statsLoading,
		isLoading,
		signups,
		products,
		stores,
		topStores,
		approvalRate: data?.approvalRate ?? 0,
	}
}
