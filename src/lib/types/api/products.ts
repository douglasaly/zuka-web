// ─── Product types ─────────────────────────────────────

export type ProductImage = {
	id: string
	url: string
	is_primary: boolean
	sort_order: number
}

export type ProductCategory = {
	id: string
	name: string
	slug: string
}

export type ProductStore = {
	id: string
	name: string
	slug: string
}

export type GroupedProduct = {
	product: {
		id: string
		store_id: string
		category_id: string
		name: string
		slug: string
		price: number
		discount_price: number | null
		currency: string
		description: string | null
		is_visible: boolean
		status: string
		created_at: string
	}
	store: ProductStore | null
	category: ProductCategory | null
	images: ProductImage[]
}

/** GET /api/products */
export type ListProductsInput = {
	categoria?: string
	search?: string
	provincia?: string
	preco_min?: number
	preco_max?: number
	recente?: 'true' | 'false'
	ordenar?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
	cursor?: string
	limit?: number
}

export type ListProductsOutput = {
	success: true
	data: GroupedProduct[]
	pagination: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
	}
}

/** POST /api/products */
export type CreateProductInput = {
	name: string
	description?: string
	categoryId: string
	price: number
	discountPrice?: number
	currency?: string
	imageUrl?: string
	imageUrls?: string[]
	status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE'
}

export type CreateProductOutput = {
	success: true
	data: {
		product: {
			id: string
			store_id: string
			category_id: string
			name: string
			slug: string
			price: number
			discount_price: number | null
			currency: string
			description: string | null
			is_visible: boolean
			status: string
			created_at: string
		}
	}
}

/** GET /api/products/[id] */
export type GetProductOutput = {
	success: true
	data: {
		product: {
			id: string
			store_id: string
			category_id: string
			name: string
			slug: string
			price: number
			discount_price: number | null
			currency: string
			description: string | null
			is_visible: boolean
			status: string
			created_at: string
		}
		store: ProductStore | null
		category: ProductCategory | null
		images: ProductImage[]
	}
}
