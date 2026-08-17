'use client'
import { useQuery } from '@tanstack/react-query'
import type { DayCount } from '@/modules/admin/ui/components/analytics/constants'
import { formatDay } from '@/modules/admin/ui/components/format-day'

async function fetchStats() {
	const res = await fetch('/api/admin/stats', { credentials: 'include' })
	if (!res.ok) throw new Error('Failed')
	return res.json()
}
async function fetchAnalytics() {
	const res = await fetch('/api/admin/analytics?days=30', {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}
async function fetchPendingStores() {
	const res = await fetch('/api/admin/stores?status=PENDING&limit=5', {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}
export function useAdminOverview() {
	const { data: stats, isLoading: statsLoading } = useQuery({
		queryKey: ['admin-stats'],
		queryFn: fetchStats,
	})
	const { data: analytics, isLoading: analyticsLoading } = useQuery({
		queryKey: ['admin-analytics-30'],
		queryFn: fetchAnalytics,
	})
	const { data: pendingData, isLoading: pendingLoading } = useQuery({
		queryKey: ['admin-pending-stores'],
		queryFn: fetchPendingStores,
	})
	const pending: Record<string, unknown>[] = pendingData?.stores ?? []
	const signups = ((analytics?.signupsByDay ?? []) as DayCount[]).map(
		(d) => ({
			...d,
			date: formatDay(d.date),
		})
	)
	const products = ((analytics?.productsByDay ?? []) as DayCount[]).map(
		(d) => ({
			...d,
			date: formatDay(d.date),
		})
	)
	return {
		stats,
		statsLoading,
		analyticsLoading,
		pendingLoading,
		pending,
		signups,
		products,
	}
}
