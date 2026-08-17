import { NextResponse } from 'next/server'
import { resolveCategoryIds } from '@/lib/categories/resolve-category-ids'
import { mapProductRow } from '@/lib/mappers/marketplace'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { sanitizeFtsTerm, sanitizeIlikeTerm } from '@/lib/validations'
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

type FilterQuery<T> = T & {
	ilike: (column: string, pattern: string) => T
	or: (filters: string) => T
}

function toPrefixTsQuery(term: string): string {
	return term
		.split(/\s+/)
		.filter((word) => word.length >= 2)
		.map((word) => `${word}:*`)
		.join(' & ')
}

function applyNameSearch<T>(query: T, ftsTerm: string, ilikeTerm: string): T {
	const q = query as FilterQuery<T>
	const prefix = toPrefixTsQuery(ftsTerm)
	if (!prefix) {
		return q.ilike('name', `%${ilikeTerm}%`)
	}
	return q.or(
		`name.ilike.%${ilikeTerm}%,search_vector.fts(portuguese)."${prefix}"`
	)
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
		if (!hasTextQuery && !hasCategory && !hasProvince && !hasOtherFilters) {
			return NextResponse.json({
				products: [],
				stores: [],
				categories: [],
			} satisfies SearchResults)
		}
		const ftsTerm = hasTextQuery ? sanitizeFtsTerm(q) : ''
		const ilikeTerm = hasTextQuery ? sanitizeIlikeTerm(q) : ''
		const supabase = createSupabaseAdmin()
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

		async function run(useFtsOr: boolean): Promise<{
			errorMessage?: string
			results: SearchResults
		}> {
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
			if (ilikeTerm) {
				productQuery = useFtsOr
					? applyNameSearch(productQuery, ftsTerm, ilikeTerm)
					: productQuery.ilike('name', `%${ilikeTerm}%`)
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
			} else {
				productQuery = productQuery.order('created_at', {
					ascending: false,
				})
			}
			const storePromise = ilikeTerm
				? (useFtsOr
						? applyNameSearch(
								supabase
									.from('stores')
									.select(
										`
										id, name, slug, logo_url, state,
										provinces ( name )
									`
									)
									.is('deleted_at', null)
									.eq('status', 'ACTIVE'),
								ftsTerm,
								ilikeTerm
							)
						: supabase
								.from('stores')
								.select(
									`
									id, name, slug, logo_url, state,
									provinces ( name )
								`
								)
								.is('deleted_at', null)
								.eq('status', 'ACTIVE')
								.ilike('name', `%${ilikeTerm}%`)
					).limit(4)
				: Promise.resolve({ data: [] as unknown[], error: null })
			const categoryPromise = ilikeTerm
				? (useFtsOr
						? applyNameSearch(
								supabase
									.from('categories')
									.select('id, name, slug')
									.is('deleted_at', null),
								ftsTerm,
								ilikeTerm
							)
						: supabase
								.from('categories')
								.select('id, name, slug')
								.is('deleted_at', null)
								.ilike('name', `%${ilikeTerm}%`)
					).limit(4)
				: Promise.resolve({ data: [] as unknown[], error: null })
			const [productRes, storeRes, categoryRes] = await Promise.all([
				productQuery.limit(6),
				storePromise,
				categoryPromise,
			])
			const errorMessage =
				productRes.error?.message ??
				('error' in storeRes ? storeRes.error?.message : undefined) ??
				('error' in categoryRes
					? categoryRes.error?.message
					: undefined)
			if (errorMessage) {
				return {
					errorMessage,
					results: { products: [], stores: [], categories: [] },
				}
			}
			const products: SearchProduct[] = (productRes.data ?? []).map((p) =>
				mapProductRow(p as Parameters<typeof mapProductRow>[0])
			)
			const stores: SearchStore[] = (
				(storeRes.data ?? []) as Array<{
					id: string
					name: string
					slug: string
					logo_url: string | null
					state: string | null
					provinces: { name: string } | null
				}>
			).map((s) => ({
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
			const categories: SearchCategory[] = (
				(categoryRes.data ?? []) as SearchCategory[]
			).map((c) => ({
				id: c.id,
				name: c.name,
				slug: c.slug,
			}))
			return { results: { products, stores, categories } }
		}

		let outcome = await run(Boolean(ilikeTerm))
		if (outcome.errorMessage) {
			console.error('[GET /api/search] FTS/or failed, using ILIKE', {
				errorMessage: outcome.errorMessage,
			})
			outcome = await run(false)
		}
		if (outcome.errorMessage) {
			throw new Error(outcome.errorMessage)
		}
		return NextResponse.json(outcome.results)
	} catch (err) {
		console.error('[GET /api/search]', err)
		return NextResponse.json(
			{ error: 'Erro ao pesquisar' },
			{ status: 500 }
		)
	}
}
