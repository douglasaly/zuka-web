import { cache } from 'react'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

const SITEMAP_PAGE_SIZE = 1000

type ImageRow = {
	url: string | null
	is_primary?: boolean | null
	position?: number | null
}

type RatingRow = {
	rating_avg?: number | null
	rating_count?: number | null
}

function asRecord(value: unknown): Record<string, unknown> | null {
	if (Array.isArray(value)) {
		const first = value[0]
		return first && typeof first === 'object'
			? (first as Record<string, unknown>)
			: null
	}
	if (value && typeof value === 'object') {
		return value as Record<string, unknown>
	}
	return null
}

function pickImages(images: ImageRow[] | null | undefined) {
	const urls = (images ?? [])
		.slice()
		.sort((a, b) => {
			if (a.is_primary && !b.is_primary) return -1
			if (!a.is_primary && b.is_primary) return 1
			return (a.position ?? 0) - (b.position ?? 0)
		})
		.map((image) => image.url)
		.filter((url): url is string =>
			Boolean(url && !url.startsWith('data:'))
		)
	return {
		imageUrl: urls[0] ?? null,
		imageUrls: urls.slice(0, 8),
	}
}

function pickRating(ratings: unknown) {
	const row = asRecord(ratings) as RatingRow | null
	return {
		ratingAvg: Number(row?.rating_avg ?? 0),
		ratingCount: Number(row?.rating_count ?? 0),
	}
}

export type ProductSeo = {
	id: string
	name: string
	description: string | null
	price: number
	discountPrice: number | null
	currency: string
	updatedAt: string | null
	imageUrl: string | null
	imageUrls: string[]
	storeName: string | null
	storeSlug: string | null
	categoryName: string | null
	ratingAvg: number
	ratingCount: number
}

export type StoreSeo = {
	id: string
	name: string
	slug: string
	description: string | null
	logoUrl: string | null
	bannerUrl: string | null
	province: string | null
	neighborhood: string | null
	updatedAt: string | null
	ratingAvg: number
	ratingCount: number
}

export type SitemapEntry = {
	path: string
	lastModified?: Date
}

export const getProductSeo = cache(
	async (id: string): Promise<ProductSeo | null> => {
		try {
			const supabase = createSupabaseAdmin()
			const { data, error } = await supabase
				.from('products')
				.select(
					'id, name, description, price, discount_price, currency, updated_at, stores!inner(name, slug, status, deleted_at), categories(name), product_images(url, is_primary, position), product_ratings(rating_avg, rating_count)'
				)
				.eq('id', id)
				.eq('is_visible', true)
				.is('deleted_at', null)
				.eq('status', 'ACTIVE')
				.eq('stores.status', 'ACTIVE')
				.is('stores.deleted_at', null)
				.maybeSingle()
			if (error || !data) return null
			const store = asRecord(data.stores)
			const category = asRecord(data.categories)
			const images = pickImages(data.product_images as ImageRow[] | null)
			const rating = pickRating(data.product_ratings)
			return {
				id: data.id,
				name: data.name,
				description: data.description,
				price: data.price,
				discountPrice: data.discount_price,
				currency: data.currency ?? 'MZN',
				updatedAt: data.updated_at,
				imageUrl: images.imageUrl,
				imageUrls: images.imageUrls,
				storeName: typeof store?.name === 'string' ? store.name : null,
				storeSlug: typeof store?.slug === 'string' ? store.slug : null,
				categoryName:
					typeof category?.name === 'string' ? category.name : null,
				ratingAvg: rating.ratingAvg,
				ratingCount: rating.ratingCount,
			}
		} catch {
			return null
		}
	}
)

export const getStoreSeo = cache(
	async (slug: string): Promise<StoreSeo | null> => {
		try {
			const supabase = createSupabaseAdmin()
			const { data, error } = await supabase
				.from('stores')
				.select(
					'id, name, slug, description, logo_url, banner_url, state, updated_at, provinces(name), store_ratings(rating_avg, rating_count)'
				)
				.eq('slug', slug)
				.eq('status', 'ACTIVE')
				.is('deleted_at', null)
				.maybeSingle()
			if (error || !data) return null
			const province = asRecord(data.provinces)
			const rating = pickRating(data.store_ratings)
			return {
				id: data.id,
				name: data.name,
				slug: data.slug,
				description: data.description,
				logoUrl: data.logo_url,
				bannerUrl: data.banner_url,
				province:
					typeof province?.name === 'string' ? province.name : null,
				neighborhood: data.state,
				updatedAt: data.updated_at,
				ratingAvg: rating.ratingAvg,
				ratingCount: rating.ratingCount,
			}
		} catch {
			return null
		}
	}
)

async function paginate<T>(
	loadPage: (
		from: number,
		to: number
	) => PromiseLike<{ data: T[] | null; error: unknown }>
) {
	const rows: T[] = []
	for (let from = 0; ; from += SITEMAP_PAGE_SIZE) {
		const { data, error } = await loadPage(
			from,
			from + SITEMAP_PAGE_SIZE - 1
		)
		if (error) throw error
		const page = data ?? []
		rows.push(...page)
		if (page.length < SITEMAP_PAGE_SIZE || rows.length >= 50_000) break
	}
	return rows
}

export async function getSitemapCatalog(): Promise<{
	products: SitemapEntry[]
	stores: SitemapEntry[]
	categories: SitemapEntry[]
}> {
	try {
		const supabase = createSupabaseAdmin()
		const [productRows, storeRows, categoryRows] = await Promise.all([
			paginate((from, to) =>
				supabase
					.from('products')
					.select('id, updated_at, stores!inner(status, deleted_at)')
					.eq('is_visible', true)
					.is('deleted_at', null)
					.eq('status', 'ACTIVE')
					.eq('stores.status', 'ACTIVE')
					.is('stores.deleted_at', null)
					.range(from, to)
			),
			paginate((from, to) =>
				supabase
					.from('stores')
					.select('slug, updated_at')
					.eq('status', 'ACTIVE')
					.is('deleted_at', null)
					.range(from, to)
			),
			supabase
				.from('categories')
				.select('slug')
				.is('deleted_at', null)
				.then(({ data, error }) => {
					if (error) throw error
					return data ?? []
				}),
		])

		return {
			products: productRows.map((row) => ({
				path: `/product/${row.id}`,
				lastModified: row.updated_at
					? new Date(row.updated_at)
					: undefined,
			})),
			stores: storeRows.map((row) => ({
				path: `/lojas/${row.slug}`,
				lastModified: row.updated_at
					? new Date(row.updated_at)
					: undefined,
			})),
			categories: categoryRows
				.filter((row) => row.slug)
				.map((row) => ({
					path: `/feed/explorar?categoria=${encodeURIComponent(row.slug)}`,
				})),
		}
	} catch {
		return { products: [], stores: [], categories: [] }
	}
}
