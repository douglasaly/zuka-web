import { type NextRequest, NextResponse } from 'next/server'
import { requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
	try {
		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error

		const { store } = auth
		const supabase = createSupabaseAdmin()

		const { searchParams } = new URL(request.url)
		const search = searchParams.get('search') ?? ''
		const status = searchParams.get('status') ?? 'all'
		const category = searchParams.get('category') ?? 'all'
		const page = Math.max(Number(searchParams.get('page')) || 1, 1)
		const limit = Math.min(
			Math.max(Number(searchParams.get('limit')) || 20, 1),
			100
		)
		const from = (page - 1) * limit

		let query = supabase
			.from('products')
			.select('*, categories(name), product_images(url, is_primary)', {
				count: 'exact',
			})
			.eq('store_id', store.id as string)
			.is('deleted_at', null)

		if (status !== 'all') {
			query = query.eq(
				'status',
				status.toUpperCase() as 'DRAFT' | 'ACTIVE' | 'INACTIVE'
			)
		}

		if (search) {
			query = query.ilike('name', `%${search}%`)
		}

		query = query.order('created_at', { ascending: false })

		const rangeEnd = from + limit
		const { data, error, count } = await query.range(from, rangeEnd)

		if (error) throw error

		const pageItems = (data ?? []).slice(0, limit)
		const hasMore = (data?.length ?? 0) > limit

		const products = pageItems.map((row) => {
			const record = row as Record<string, unknown>
			const images = record.product_images as Array<{
				url: string
				is_primary?: boolean
			}> | null
			const primary =
				images?.find((img) => img.is_primary) ?? images?.[0]

			// Filtrar por categoria nome (server-side)
			const catName =
				(record.categories as { name: string } | null)?.name ?? null
			if (category !== 'all' && catName !== category) return null

			return {
				id: record.id as string,
				name: record.name as string,
				price: (record.price as number) / 100,
				discountPrice:
					record.discount_price != null
						? (record.discount_price as number) / 100
						: null,
				currency: record.currency as string,
				status: record.status as string,
				isVisible: record.is_visible as boolean,
				categoryName: catName,
				image: primary?.url ?? null,
			}
		}).filter(Boolean)

		return NextResponse.json({
			success: true,
			products,
			store,
			hasMore,
			total: count ?? 0,
		})
	} catch (error) {
		console.error('[GET /api/seller/products]', error)
		return NextResponse.json(
			{ error: 'Falha ao carregar produtos da loja' },
			{ status: 500 }
		)
	}
}
