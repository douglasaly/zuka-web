import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { mapOrderRow } from '@/lib/mappers/marketplace'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const supabase = createSupabaseAdmin()
		const { data, error } = await supabase
			.from('orders')
			.select('*, stores(name, logo_url)')
			.eq('buyer_id', user.id as string)
			.order('created_at', { ascending: false })

		if (error) throw error

		const rows = (data ?? []) as Array<Record<string, unknown>>
		const orders = rows.map((row) =>
			mapOrderRow({
				id: row.id as string,
				total: row.total as number,
				currency: row.currency as string,
				item_count: row.item_count as number,
				status: row.status as string,
				created_at: row.created_at as string,
				stores: row.stores as { name: string; logo_url?: string | null },
			})
		)

		return NextResponse.json({ success: true, orders })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to load orders' },
			{ status: 500 }
		)
	}
}
