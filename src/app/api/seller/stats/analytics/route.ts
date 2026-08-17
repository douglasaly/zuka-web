import { type NextRequest, NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import {
	getMockSellerAnalytics,
	parseAnalyticsRange,
} from '@/modules/seller/ui/components/analytics/mock-data'
export async function GET(request: NextRequest) {
	try {
		const auth = await requireSellerStore({ permission: 'stats.read' })
		if (isSellerStoreAuthError(auth)) return auth.error
		const { searchParams } = new URL(request.url)
		const range = parseAnalyticsRange(searchParams.get('range'))
		const data = getMockSellerAnalytics(range)
		return NextResponse.json({
			success: true,
			mock: true,
			range,
			data,
		})
	} catch (err) {
		console.error('[GET /api/seller/stats/analytics]', err)
		return NextResponse.json(
			{ error: 'Não foi possível carregar o desempenho' },
			{ status: 500 }
		)
	}
}
