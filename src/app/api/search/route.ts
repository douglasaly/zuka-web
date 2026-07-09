import { NextResponse } from 'next/server'
import type { Product } from '@/lib/api/Product'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { StoreProfile } from '@/types/marketplace'

export type SearchProduct = Product & {
	storeName: string
	storeSlug: string
}

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
		const q = searchParams.get('q')?.trim()
		const categorySlug = searchParams.get('categoria')
		const provinceSlug = searchParams.get('provincia')
		const minPrice = searchParams.get('preco_min')
		const maxPrice = searchParams.get('preco_max')
		const isNew = searchParams.get('recente')
		const sort = searchParams.get('ordenar') || 'relevance'

		const normalizedMinPrice = minPrice ? Number(minPrice) * 100 : undefined
		const normalizedMaxPrice = maxPrice ? Number(maxPrice) * 100 : undefined

		if (!q) {
			return NextResponse.json({
				products: [],
				stores: [],
				categories: [],
			})
		}

		const supabase = createSupabaseAdmin()
		const term = `%${q}%`
		const [catLookup, provLookup] = await Promise.all([
			categorySlug && categorySlug !== 'all'
				? supabase
						.from('categories')
						.select('id')
						.eq('slug', categorySlug)
						.maybeSingle()
				: Promise.resolve({ data: null }),
			provinceSlug && provinceSlug !== 'all'
				? supabase
						.from('provinces')
						.select('id')
						.eq('slug', provinceSlug)
						.maybeSingle()
				: Promise.resolve({ data: null }),
		])

		const categoryId = catLookup?.data?.id
		const provinceId = provLookup?.data?.id

		let productQuery = supabase
			.from('products')
			.select(
				`
				id, name, slug, price, discount_price, currency,
				stores!inner ( id, name, slug ),
				product_images ( url, is_primary )
			`
			)
			.eq('is_visible', true)
			.is('deleted_at', null)
			.eq('stores.status', 'ACTIVE')
			.is('stores.deleted_at', null)
			.ilike('name', term)

		if (categoryId)
			productQuery = productQuery.eq('category_id', categoryId)

		if (provinceId)
			productQuery = productQuery.eq('stores.province_id', provinceId)

		if (minPrice)
			productQuery = productQuery.gte('price', normalizedMinPrice)

		if (maxPrice)
			productQuery = productQuery.lte('price', normalizedMaxPrice)

		if (isNew === 'true') {
			const fourteenDaysAgo = new Date(
				Date.now() - 14 * 24 * 60 * 60 * 1000
			).toISOString()
			productQuery = productQuery.gte('created_at', fourteenDaysAgo)
		}

		if (sort === 'price_asc')
			productQuery = productQuery.order('price', { ascending: true })
		else if (sort === 'price_desc')
			productQuery = productQuery.order('price', { ascending: false })
		else if (sort === 'newest')
			productQuery = productQuery.order('created_at', {
				ascending: false,
			})

		const [productRes, storeRes, categoryRes] = await Promise.all([
			productQuery.limit(6),
			supabase
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
				.limit(4),
			supabase
				.from('categories')
				.select('id, name, slug')
				.is('deleted_at', null)
				.ilike('name', term)
				.limit(4),
		])

		const products: SearchProduct[] = (productRes.data ?? []).map(
			(p: any) => ({
				id: p.id,
				name: p.name,
				slug: p.slug,
				price: p.price,
				discountPrice: p.discount_price,
				currency: p.currency ?? 'MZN',
				image:
					p.product_images?.find((i: any) => i.is_primary)?.url ??
					null,
				storeName: p.stores?.name ?? '',
				storeSlug: p.stores?.slug ?? '',
			})
		)

		const stores: SearchStore[] = (storeRes.data ?? []).map((s: any) => ({
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
		}))

		const categories: SearchCategory[] = (categoryRes.data ?? []).map(
			(c: any) => ({
				id: c.id,
				name: c.name,
				slug: c.slug,
			})
		)

		return NextResponse.json({ products, stores, categories })
	} catch (err) {
		console.error('[GET /api/search]', err)
		return NextResponse.json(
			{ error: 'Erro ao pesquisar' },
			{ status: 500 }
		)
	}
}
