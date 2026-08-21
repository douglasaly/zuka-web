export interface Product {
	id: string
	name: string
	price: number
	discountPrice?: number | null
	currency: string
	image: string | null
	slug: string | null
	negotiable?: boolean
	hasDelivery?: boolean
	isNew?: boolean
	rating?: number
	reviewCount?: number
	storeId: string
	storeName: string
	storeSlug: string
	storeLocation: string
	storeRating?: number
	storeVerified?: boolean
	storeAvatar: string | null
	storePhone: string | null
	description: string
	categoryId: string
	categoryName?: string
}

export type ProductStoreSummary = {
	id: string
	name: string
	slug: string
	logoUrl: string | null
	verified: boolean
	location: string
	rating?: number
	reviewCount?: number
	hasDelivery?: boolean
}
export type ProductCategorySummary = {
	id: string
	name: string
}
export type ProductListItem = {
	id: string
	name: string
	slug: string | null
	price: number
	discountPrice: number | null
	currency: string
	image: string | null
	hasDelivery: boolean
	isNew: boolean
	negotiable: boolean
	rating?: number
	reviewCount?: number
	store: ProductStoreSummary
	category: ProductCategorySummary | null
}
export type ProductDetail = ProductListItem & {
	description: string
	images: string[]
	store: ProductStoreSummary & {
		whatsapp?: string | null
		phone?: string | null
		email?: string | null
		bannerUrl?: string | null
	}
}

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
