import { uuidv7 } from 'uuidv7'
import {
	apiCursorList,
	apiError,
	apiSuccess,
	ErrorCode,
	withErrorHandling,
} from '@/lib/api-response'
import { requireSeller } from '@/lib/auth'
import { isR2PublicUrl } from '@/lib/storage/r2'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import {
	CreateProductSchema,
	CursorPaginationSchema,
	ProductFiltersSchema,
} from '@/lib/validations'
import { shuffle } from '@/utils/shuffle'
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

// ─── GET /api/products ──────────────────────────────────
// Lista pública de produtos com filtros. Cursor-based.

export const GET = withErrorHandling(async (request) => {
	const { searchParams } = new URL(request.url)

	// Parse filtros
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

	// Lookup de category e province em paralelo
	const [catLookup, provLookup] = await Promise.all([
		filters.categoria && filters.categoria !== 'all'
			? supabase
					.from('categories')
					.select('id')
					.eq('slug', filters.categoria)
					.maybeSingle()
			: Promise.resolve({ data: null }),
		filters.provincia && filters.provincia !== 'all'
			? supabase
					.from('provinces')
					.select('id')
					.eq('slug', filters.provincia)
					.maybeSingle()
			: Promise.resolve({ data: null }),
	])

	const categoryId = catLookup?.data?.id
	const provinceId = provLookup?.data?.id

	// Construir query com filtros
	let query = supabase
		.from('products')
		.select('*, stores!inner(*), categories(*), product_images(*)')
		.eq('is_visible', true)
		.is('deleted_at', null)
		.eq('stores.status', 'ACTIVE')
		.is('stores.deleted_at', null)
		.limit(limit + 1)

	if (categoryId) {
		query = query.eq('category_id', categoryId)
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

	// Cursor-based ordering
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

	// Agrupar e limitar a 2 produtos por loja (shuffle)
	let result = groupProductsWithRelations(rows)

	const groupedByStore: Record<string, typeof result> = {}
	for (const item of result) {
		const storeId = item.store?.id as string | undefined
		if (!storeId) continue
		if (!groupedByStore[storeId]) groupedByStore[storeId] = []
		groupedByStore[storeId].push(item)
	}

	const final: typeof result = []
	for (const storeId in groupedByStore) {
		final.push(...shuffle(groupedByStore[storeId]).slice(0, 2))
	}
	result = shuffle(final)

	const lastRow = rows[rows.length - 1]
	const nextCursor = hasMore ? (lastRow?.created_at ?? null) : null

	return apiCursorList(result, { hasMore, nextCursor, limit })
})

// ─── POST /api/products ─────────────────────────────────
// Criar produto (vendedor autenticado).

export const POST = withErrorHandling(async (request) => {
	const auth = await requireSeller()

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
		quantity,
		imageUrl,
	} = parsed.data

	if (imageUrl && !isR2PublicUrl(imageUrl)) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			'A imagem deve ser carregada para o armazenamento'
		)
	}

	const supabase = createSupabaseAdmin()
	const productId = uuidv7()
	let slug = Slug(name)

	// Slug único
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
			is_visible: true,
			status: 'ACTIVE',
			price: Math.round(price * 100),
			discount_price:
				discountPrice != null ? Math.round(discountPrice * 100) : null,
			currency,
		})
		.select('*')
		.single()

	if (productError) throw productError

	await supabase.from('product_stock').insert({
		id: uuidv7(),
		product_id: productId,
		quantity: quantity,
		reserved: 0,
	})

	if (imageUrl) {
		await supabase.from('product_images').insert({
			id: uuidv7(),
			product_id: productId,
			url: imageUrl,
			position: 0,
			is_primary: true,
			alt: name,
		})
	}

	return apiSuccess({ product }, 201)
})
