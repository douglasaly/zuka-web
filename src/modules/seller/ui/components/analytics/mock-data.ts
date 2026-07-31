/**
 * Mock seller analytics until real event instrumentation ships.
 * Prices in major MZN units (same as formatPrice consumers).
 */

export type AnalyticsRange = '7d' | '30d' | '90d'

export type SellerAnalyticsMock = {
	totalSales: number
	totalOrders: number
	totalViews: number
	totalFollowers: number
	productCount: number
	/** Percentage change vs previous period (positive = up). */
	changes: {
		totalSales: number
		totalOrders: number
		totalViews: number
		totalFollowers: number
		productCount: number
	}
	/** Daily sales for the spark/list chart (major units). */
	dailySales: Array<{ date: string; sales: number }>
}

const MOCK_BY_RANGE: Record<AnalyticsRange, SellerAnalyticsMock> = {
	'7d': {
		totalSales: 18450,
		totalOrders: 12,
		totalViews: 428,
		totalFollowers: 86,
		productCount: 24,
		changes: {
			totalSales: 12.4,
			totalOrders: 8.3,
			totalViews: 21.0,
			totalFollowers: 3.6,
			productCount: 0,
		},
		dailySales: [
			{ date: '2026-07-24', sales: 2100 },
			{ date: '2026-07-25', sales: 1850 },
			{ date: '2026-07-26', sales: 3200 },
			{ date: '2026-07-27', sales: 1400 },
			{ date: '2026-07-28', sales: 2750 },
			{ date: '2026-07-29', sales: 3900 },
			{ date: '2026-07-30', sales: 3250 },
		],
	},
	'30d': {
		totalSales: 67200,
		totalOrders: 48,
		totalViews: 1840,
		totalFollowers: 86,
		productCount: 24,
		changes: {
			totalSales: 6.1,
			totalOrders: -4.2,
			totalViews: 15.8,
			totalFollowers: 9.0,
			productCount: 4.3,
		},
		dailySales: [
			{ date: '2026-07-01', sales: 1800 },
			{ date: '2026-07-05', sales: 2400 },
			{ date: '2026-07-10', sales: 3100 },
			{ date: '2026-07-15', sales: 2200 },
			{ date: '2026-07-20', sales: 4500 },
			{ date: '2026-07-25', sales: 3800 },
			{ date: '2026-07-30', sales: 3250 },
		],
	},
	'90d': {
		totalSales: 198500,
		totalOrders: 142,
		totalViews: 6120,
		totalFollowers: 86,
		productCount: 24,
		changes: {
			totalSales: 18.7,
			totalOrders: 11.2,
			totalViews: 34.5,
			totalFollowers: 22.1,
			productCount: 14.0,
		},
		dailySales: [
			{ date: '2026-05-01', sales: 12000 },
			{ date: '2026-05-15', sales: 15500 },
			{ date: '2026-06-01', sales: 18200 },
			{ date: '2026-06-15', sales: 21000 },
			{ date: '2026-07-01', sales: 24800 },
			{ date: '2026-07-15', sales: 28500 },
			{ date: '2026-07-30', sales: 32500 },
		],
	},
}

export function getMockSellerAnalytics(
	range: AnalyticsRange
): SellerAnalyticsMock {
	return MOCK_BY_RANGE[range] ?? MOCK_BY_RANGE['30d']
}

export function parseAnalyticsRange(raw: string | null): AnalyticsRange {
	if (raw === '7d' || raw === '30d' || raw === '90d') return raw
	const days = Number(raw)
	if (days <= 7) return '7d'
	if (days <= 30) return '30d'
	return '90d'
}
