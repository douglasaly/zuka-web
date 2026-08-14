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
