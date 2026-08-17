'use client'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
	type AnalyticsRange,
	getMockSellerAnalytics,
	type SellerAnalyticsMock,
} from '@/modules/seller/ui/components/analytics/mock-data'

async function fetchAnalytics(
	range: AnalyticsRange
): Promise<SellerAnalyticsMock> {
	const res = await fetch(`/api/seller/stats/analytics?range=${range}`)
	if (!res.ok) {
		return getMockSellerAnalytics(range)
	}
	const json = await res.json()
	return (json.data ?? json) as SellerAnalyticsMock
}
export function useSellerAnalytics() {
	const [range, setRange] = useState<AnalyticsRange>('30d')
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ['seller-analytics', range],
		queryFn: () => fetchAnalytics(range),
	})
	const maxDaily = Math.max(
		...(data?.dailySales.map((d) => d.sales) ?? [1]),
		1
	)
	return {
		range,
		setRange,
		data,
		isLoading,
		isError,
		refetch,
		maxDaily,
	}
}
