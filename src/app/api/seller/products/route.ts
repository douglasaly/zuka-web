import { type NextRequest, NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { sanitizeIlikeTerm } from '@/lib/validations'

const PER_PAGE_OPTIONS = [5, 10, 25, 50, 100] as const
const DEFAULT_PER_PAGE = 5
function parsePerPage(raw: string | null): number {
	const n = Number(raw ?? DEFAULT_PER_PAGE)
	if (PER_PAGE_OPTIONS.includes(n as (typeof PER_PAGE_OPTIONS)[number])) {
		return n
	}
	if (!Number.isNaN(n) && n >= 1 && n <= 100) return Math.floor(n)
	return DEFAULT_PER_PAGE
}
export async function GET(request: NextRequest) {
	try {
		const auth = await requireSellerStore({ permission: 'product.read' })
		if (isSellerStoreAuthError(auth)) return auth.error
		const { store } = auth
		const supabase = createSupabaseAdmin()
		const { searchParams } = new URL(request.url)
		const search = searchParams.get('search') ?? ''
		const status = searchParams.get('status') ?? 'all'
		const category = searchParams.get('category') ?? 'all'
		const minPrice = searchParams.get('minPrice')
		const maxPrice = searchParams.get('maxPrice')
		const page = Math.max(Number(searchParams.get('page')) || 1, 1)
		const perPage = parsePerPage(
			searchParams.get('perPage') ?? searchParams.get('limit')
		)
		const from = (page - 1) * perPage
		let query = supabase
			.from('products')
			.select(
				'*, categories(id, name), product_images(url, is_primary, position)',
				{ count: 'exact' }
			)
			.eq('store_id', store.id as string)
			.is('deleted_at', null)
		if (status !== 'all') {
			query = query.eq(
				'status',
				status.toUpperCase() as 'DRAFT' | 'ACTIVE' | 'INACTIVE'
			)
		}
		const searchTerm = sanitizeIlikeTerm(search)
		if (searchTerm) {
			query = query.ilike('name', `%${searchTerm}%`)
		}
		if (category !== 'all') {
			query = query.eq('category_id', category)
		}
		if (minPrice != null && minPrice !== '') {
			query = query.gte('price', Math.round(Number(minPrice) * 100))
		}
		if (maxPrice != null && maxPrice !== '') {
			query = query.lte('price', Math.round(Number(maxPrice) * 100))
		}
		query = query.order('created_at', { ascending: false })
		const rangeEnd = from + perPage
		const { data, error, count } = await query.range(from, rangeEnd)
		if (error) throw error
		const total = count ?? 0
		const totalPages = Math.max(1, Math.ceil(total / perPage) || 1)
		const safePage = Math.min(page, totalPages)
		const pageItems = (data ?? []).slice(0, perPage)
		const products = pageItems.map((row) => {
			const record = row as Record<string, unknown>
			const images = (
				(record.product_images as Array<{
					url: string
					is_primary?: boolean
					position?: number
				}> | null) ?? []
			).sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
			const primary =
				images.find((img) => img.is_primary) ?? images[0] ?? null
			const cat = record.categories as {
				id: string
				name: string
			} | null
			return {
				id: record.id as string,
				name: record.name as string,
				description: (record.description as string | null) ?? null,
				price: (record.price as number) / 100,
				discountPrice:
					record.discount_price != null
						? (record.discount_price as number) / 100
						: null,
				currency: record.currency as string,
				status: record.status as string,
				isVisible: record.is_visible as boolean,
				categoryName: cat?.name ?? null,
				image: primary?.url ?? null,
				images: images.map((img) => img.url),
			}
		})
		return NextResponse.json({
			success: true,
			products,
			store,
			page: safePage,
			perPage,
			total,
			totalPages,
			hasMore: (data?.length ?? 0) > perPage || safePage < totalPages,
		})
	} catch (error) {
		console.error('[GET /api/seller/products]', error)
		return NextResponse.json(
			{ error: 'Falha ao carregar produtos da loja' },
			{ status: 500 }
		)
	}
}
