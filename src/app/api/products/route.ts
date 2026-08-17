import { uuidv7 } from 'uuidv7'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import {
	apiCursorList,
	apiError,
	apiSuccess,
	ErrorCode,
	withErrorHandling,
} from '@/lib/axios/api-response'
import { resolveCategoryIds } from '@/lib/categories/resolve-category-ids'
import { isR2PublicUrl } from '@/lib/storage/r2'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import {
	CreateProductSchema,
	CursorPaginationSchema,
	ProductFiltersSchema,
} from '@/lib/validations'
import { shuffleWithStoreDiversity } from '@/utils/shuffle'
import { Slug } from '@/utils/slug'

type ProductRow = {
	id: string
	store_id: string
	category_id: string
	name: string
	slug: string | null
	is_visible: boolean | null
	description: string | null
	status: string | null
	price: number
	discount_price: number | null
	currency: string | null
	created_at: string | null
	stores: Record<string, unknown> | null
	categories: Record<string, unknown> | null
	product_images: Array<Record<string, unknown>> | null
}
function groupProductsWithRelations(rows: ProductRow[]) {
	const map = new Map<
		string,
		{
			product: Record<string, unknown>
			store: Record<string, unknown> | null
			category: Record<string, unknown> | null
			images: Array<Record<string, unknown>>
		}
	>()
	for (const row of rows) {
		if (!map.has(row.id)) {
			const { stores, categories, product_images, ...product } = row
			map.set(row.id, {
				product,
				store: stores,
				category: categories,
				images: product_images ?? [],
			})
		}
	}
	return Array.from(map.values())
}
export const GET = withErrorHandling(async (request) => {
	const { searchParams } = new URL(request.url)
	const filters = ProductFiltersSchema.parse({
		categoria: searchParams.get('categoria') ?? undefined,
		search: searchParams.get('search') ?? undefined,
		provincia: searchParams.get('provincia') ?? undefined,
		preco_min: searchParams.get('preco_min') ?? undefined,
		preco_max: searchParams.get('preco_max') ?? undefined,
		recente: searchParams.get('recente') ?? undefined,
		ordenar: searchParams.get('ordenar') ?? undefined,
	})
	const { limit, cursor } = CursorPaginationSchema.parse({
		limit: searchParams.get('limit') ?? undefined,
		cursor: searchParams.get('cursor') ?? undefined,
	})
	const supabase = createSupabaseAdmin()
	const [categoryIds, provLookup] = await Promise.all([
		filters.categoria && filters.categoria !== 'all'
			? resolveCategoryIds(supabase, filters.categoria)
			: Promise.resolve([] as string[]),
		filters.provincia && filters.provincia !== 'all'
			? supabase
					.from('provinces')
					.select('id')
					.eq('slug', filters.provincia)
					.maybeSingle()
			: Promise.resolve({ data: null }),
	])
	const provinceId = provLookup?.data?.id
	let query = supabase
		.from('products')
		.select(
			'id, store_id, category_id, name, slug, is_visible, description, status, price, discount_price, currency, created_at, stores!inner(id, name, slug, logo_url, verified_at, state, phone, has_delivery, provinces(name), status, store_ratings(rating_avg, rating_count)), categories(id, name, slug), product_images(url, is_primary, position), product_ratings(rating_avg, rating_count)'
		)
		.eq('is_visible', true)
		.is('deleted_at', null)
		.eq('stores.status', 'ACTIVE')
		.is('stores.deleted_at', null)
		.limit(limit + 1)
	if (categoryIds.length > 0) {
		query = query.in('category_id', categoryIds)
	}
	if (provinceId) {
		query = query.eq('stores.province_id', provinceId)
	}
	if (filters.search) {
		query = query.ilike('name', `%${filters.search}%`)
	}
	if (filters.preco_min) {
		query = query.gte('price', Math.round(filters.preco_min * 100))
	}
	if (filters.preco_max) {
		query = query.lte('price', Math.round(filters.preco_max * 100))
	}
	if (filters.recente === 'true') {
		const fourteenDaysAgo = new Date(
			Date.now() - 14 * 24 * 60 * 60 * 1000
		).toISOString()
		query = query.gte('created_at', fourteenDaysAgo)
	}
	if (filters.ordenar === 'price_asc') {
		query = query.order('price', { ascending: true })
	} else if (filters.ordenar === 'price_desc') {
		query = query.order('price', { ascending: false })
	} else {
		query = query.order('created_at', { ascending: false })
	}
	if (
		cursor &&
		filters.ordenar !== 'price_asc' &&
		filters.ordenar !== 'price_desc'
	) {
		query = query.lt('created_at', cursor)
	}
	const { data, error } = await query
	if (error) throw error
	const hasMore = (data?.length ?? 0) > limit
	const rows = (
		hasMore ? data?.slice(0, limit) : (data ?? [])
	) as ProductRow[]
	const grouped = groupProductsWithRelations(rows)
	const shouldShuffle =
		filters.ordenar !== 'price_asc' &&
		filters.ordenar !== 'price_desc' &&
		filters.ordenar !== 'newest'
	const result = shouldShuffle
		? shuffleWithStoreDiversity(
				grouped,
				(item) => item.store?.id as string | undefined
			)
		: grouped
	const lastRow = rows[rows.length - 1]
	const nextCursor = hasMore ? (lastRow?.created_at ?? null) : null
	return apiCursorList(result, { hasMore, nextCursor, limit })
})
export const POST = withErrorHandling(async (request) => {
	const auth = await requireSellerStore({ permission: 'product.create' })
	if (isSellerStoreAuthError(auth)) throw auth.error
	const body = await request.json()
	const parsed = CreateProductSchema.safeParse(body)
	if (!parsed.success) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			parsed.error.issues[0].message
		)
	}
	const {
		name,
		description,
		categoryId,
		price,
		discountPrice,
		currency,
		imageUrl,
		imageUrls,
		status,
	} = parsed.data
	const urls =
		imageUrls && imageUrls.length > 0
			? imageUrls
			: imageUrl
				? [imageUrl]
				: []
	if (urls.some((url) => !isR2PublicUrl(url))) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			'A imagem deve ser carregada para o armazenamento'
		)
	}
	const nextStatus = status ?? 'ACTIVE'
	const isVisible = nextStatus === 'ACTIVE'
	const supabase = createSupabaseAdmin()
	const productId = uuidv7()
	let slug = Slug(name)
	const { data: slugConflict } = await supabase
		.from('products')
		.select('id')
		.eq('slug', slug)
		.maybeSingle()
	if (slugConflict) {
		slug = `${slug}-${uuidv7().slice(0, 6)}`
	}
	const { data: product, error: productError } = await supabase
		.from('products')
		.insert({
			id: productId,
			store_id: auth.store.id,
			category_id: categoryId,
			name,
			slug,
			description: description ?? null,
			is_visible: isVisible,
			status: nextStatus,
			price: Math.round(price * 100),
			discount_price:
				discountPrice != null ? Math.round(discountPrice * 100) : null,
			currency,
		})
		.select('*')
		.single()
	if (productError) throw productError
	if (urls.length > 0) {
		await supabase.from('product_images').insert(
			urls.map((url, index) => ({
				id: uuidv7(),
				product_id: productId,
				url,
				position: index,
				is_primary: index === 0,
				alt: name,
			}))
		)
	}
	return apiSuccess({ product }, 201)
})
