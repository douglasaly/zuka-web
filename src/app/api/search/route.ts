import { NextResponse } from 'next/server'
import { resolveCategoryIds } from '@/lib/categories/resolve-category-ids'
import { mapProductRow } from '@/lib/mappers/marketplace'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { Product, StoreProfile } from '@/types/marketplace'

export type SearchProduct = Product

export type SearchStore = StoreProfile

export type SearchCategory = {
	id: string
	name: string
	slug: string
}

export type SearchResults = {
	products: SearchProduct[]
	stores: SearchStore[]
	categories: SearchCategory[]
}

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const q = searchParams.get('q')?.trim() ?? ''
		const categorySlug = searchParams.get('categoria')
		const provinceSlug = searchParams.get('provincia')
		const minPrice = searchParams.get('preco_min')
		const maxPrice = searchParams.get('preco_max')
		const isNew = searchParams.get('recente')
		const sort = searchParams.get('ordenar') || 'relevance'

		const normalizedMinPrice = minPrice ? Number(minPrice) * 100 : undefined
		const normalizedMaxPrice = maxPrice ? Number(maxPrice) * 100 : undefined

		const hasTextQuery = q.length > 0
		const hasCategory = Boolean(categorySlug) && categorySlug !== 'all'
		const hasProvince = Boolean(provinceSlug) && provinceSlug !== 'all'
		const hasOtherFilters = Boolean(
			minPrice || maxPrice || isNew === 'true'
		)

		// Need a text query and/or at least one browse filter
		if (!hasTextQuery && !hasCategory && !hasProvince && !hasOtherFilters) {
			return NextResponse.json({
				products: [],
				stores: [],
				categories: [],
			} satisfies SearchResults)
		}

		const supabase = createSupabaseAdmin()
		const term = hasTextQuery ? `%${q}%` : null

		const [categoryIds, provLookup] = await Promise.all([
			hasCategory && categorySlug
				? resolveCategoryIds(supabase, categorySlug)
				: Promise.resolve([] as string[]),
			hasProvince && provinceSlug
				? supabase
						.from('provinces')
						.select('id')
						.eq('slug', provinceSlug)
						.maybeSingle()
				: Promise.resolve({ data: null }),
		])

		const provinceId = provLookup?.data?.id as string | undefined

		let productQuery = supabase
			.from('products')
			.select(
				`
				id, store_id, category_id, name, slug, price, discount_price, currency,
				stores!inner ( id, name, slug, logo_url, has_delivery ),
				product_images ( url, is_primary ),
				product_ratings ( rating_avg, rating_count )
			`
			)
			.eq('is_visible', true)
			.is('deleted_at', null)
			.eq('stores.status', 'ACTIVE')
			.is('stores.deleted_at', null)

		if (term) {
			productQuery = productQuery.ilike('name', term)
		}

		if (categoryIds.length > 0) {
			productQuery = productQuery.in('category_id', categoryIds)
		}

		if (provinceId) {
			productQuery = productQuery.eq('stores.province_id', provinceId)
		}

		if (minPrice && normalizedMinPrice != null) {
			productQuery = productQuery.gte('price', normalizedMinPrice)
		}

		if (maxPrice && normalizedMaxPrice != null) {
			productQuery = productQuery.lte('price', normalizedMaxPrice)
		}

		if (isNew === 'true') {
			const fourteenDaysAgo = new Date(
				Date.now() - 14 * 24 * 60 * 60 * 1000
			).toISOString()
			productQuery = productQuery.gte('created_at', fourteenDaysAgo)
		}

		if (sort === 'price_asc') {
			productQuery = productQuery.order('price', { ascending: true })
		} else if (sort === 'price_desc') {
			productQuery = productQuery.order('price', { ascending: false })
		} else if (sort === 'newest') {
			productQuery = productQuery.order('created_at', {
				ascending: false,
			})
		} else {
			productQuery = productQuery.order('created_at', {
				ascending: false,
			})
		}

		const storePromise = term
			? supabase
					.from('stores')
					.select(
						`
						id, name, slug, logo_url, state,
						provinces ( name )
					`
					)
					.is('deleted_at', null)
					.eq('status', 'ACTIVE')
					.ilike('name', term)
					.limit(4)
			: Promise.resolve({ data: [] as unknown[] })

		const categoryPromise = term
			? supabase
					.from('categories')
					.select('id, name, slug')
					.is('deleted_at', null)
					.ilike('name', term)
					.limit(4)
			: Promise.resolve({ data: [] as unknown[] })

		const [productRes, storeRes, categoryRes] = await Promise.all([
			productQuery.limit(6),
			storePromise,
			categoryPromise,
		])

		if (productRes.error) throw productRes.error

		const products: SearchProduct[] = (productRes.data ?? []).map((p) =>
			mapProductRow(p as Parameters<typeof mapProductRow>[0])
		)

		const stores: SearchStore[] = ((storeRes.data ?? []) as any[]).map(
			(s) => ({
				id: s.id,
				name: s.name,
				slug: s.slug,
				location: s.provinces?.name ?? '',
				neighborhood: s.state ?? '',
				verified: false,
				rating: 0,
				reviewCount: 0,
				followers: 0,
				productCount: 0,
				bannerUrl: null,
				logoUrl: s.logo_url,
				whatsapp: null,
				phone: null,
				about: '',
				email: null,
				status: null,
			})
		)

		const categories: SearchCategory[] = (
			(categoryRes.data ?? []) as any[]
		).map((c) => ({
			id: c.id,
			name: c.name,
			slug: c.slug,
		}))

		return NextResponse.json({ products, stores, categories })
	} catch (err) {
		console.error('[GET /api/search]', err)
		return NextResponse.json(
			{ error: 'Erro ao pesquisar' },
			{ status: 500 }
		)
	}
}
