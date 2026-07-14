// ─── Search routes ─────────────────────────────────────

export type SearchProductResult = {
	id: string
	name: string
	slug: string
	price: number
	discountPrice: number | null
	currency: string
	image: string | null
	storeName: string
	storeSlug: string
}

export type SearchStoreResult = {
	id: string
	name: string
	slug: string
	location: string
	neighborhood: string
	logoUrl: string | null
	verified: boolean
	rating: number
	reviewCount: number
	followers: number
	productCount: number
}

export type SearchCategoryResult = {
	id: string
	name: string
	slug: string
}

/** GET /api/search */
export type SearchInput = {
	q: string
	categoria?: string
	provincia?: string
	preco_min?: number
	preco_max?: number
	recente?: 'true'
	ordenar?: 'relevance' | 'price_asc' | 'price_desc' | 'newest'
}

export type SearchOutput = {
	products: SearchProductResult[]
	stores: SearchStoreResult[]
	categories: SearchCategoryResult[]
}
