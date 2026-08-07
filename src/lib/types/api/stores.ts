// ─── Store routes ──────────────────────────────────────

export type StoreRow = {
	id: string
	name: string
	slug: string
	description: string | null
	state: string
	status: string | null
	logo_url: string | null
	banner_url: string | null
	phone: string | null
	whatsapp: string | null
	email: string | null
	verified_at: string | null
	created_at: string
	updated_at: string
	provinces: { name: string; slug: string } | null
}

export type StoreListItem = {
	id: string
	name: string
	slug: string
	status: string | null
	description: string | null
	logoUrl: string | null
	bannerUrl: string | null
	state: string
	location: string
	neighborhood: string
	about: string
	email: string | null
	phone: string | null
	whatsapp: string | null
	verified: boolean
	rating: number
	reviewCount: number
	followers: number
	productCount: number
}

/** GET /api/stores — always ACTIVE only */
export type ListStoresInput = {
	search?: string
	limit?: number
	offset?: number
}

export type ListStoresOutput = {
	success: true
	data: {
		stores: StoreListItem[]
		pagination: {
			total: number
			limit: number
			offset: number
			hasMore: boolean
			nextCursor: string | null
		}
	}
}

/** POST /api/stores */
export type CreateStoreInput = {
	name: string
	description?: string
	provinceId: string
	categoryId?: string
	neighborhood: string
	email?: string
	phone?: string
	whatsapp?: string
}

export type CreateStoreOutput = {
	success: true
	data: {
		store: {
			id: string
			owner_id: string
			seller_profile_id: string
			name: string
			slug: string
			description: string | null
			province_id: string
			main_store_category_id: string | null
			state: string
			email: string | null
			phone: string | null
			whatsapp: string | null
			status: string
			created_at: string
		}
	}
}

/** GET /api/stores/[slug] */
export type GetStoreBySlugOutput = {
	success: true
	data: {
		store: {
			id: string
			name: string
			slug: string
			description: string | null
			state: string
			status: string | null
			logo_url: string | null
			banner_url: string | null
			phone: string | null
			whatsapp: string | null
			email: string | null
			verified_at: string | null
			created_at: string
			updated_at: string
			provinces: { name: string } | null
			product_count: number
			follower_count: number
		}
		products: {
			id: string
			store_id: string
			category_id: string | null
			name: string
			slug: string
			price: number
			discount_price: number | null
			currency: string
			description: string | null
			is_visible: boolean
			status: string
			created_at: string
			categories: { id: string; name: string } | null
			product_images: { url: string; is_primary: boolean }[]
		}[]
		page: number
		limit: number
	}
}

/** GET /api/stores/[slug]/products */
export type StoreProductItem = {
	id: string
	name: string
	slug: string
	price: number
	currency: string
	image: string | null
	category: { id: string; name: string } | null
}

export type ListStoreProductsOutput = {
	success: true
	data: {
		store: { id: string; name: string; slug: string }
		products: StoreProductItem[]
	}
	metadata: { productCount: number }
	pagination: {
		nextCursor: string | null
		hasMore: boolean
		limit: number
	}
}

/** POST /api/stores/[slug]/follow */
export type FollowStoreOutput = {
	success: true
	action: 'followed'
}

/** DELETE /api/stores/[slug]/follow */
export type UnfollowStoreOutput = {
	success: true
	action: 'unfollowed'
}

/** GET /api/stores/[slug]/is-following */
export type IsFollowingOutput = {
	isFollowing: boolean
}

/** GET /api/stores/followed */
export type FollowedStoreItem = {
	followed_at: string | null
	store: {
		id: string
		name: string
		logo_url: string | null
		slug: string
		state: string
		verified_at: string | null
		province: { name: string }
	}
}

export type ListFollowedStoresOutput = {
	data: FollowedStoreItem[]
	metaData: {
		total: number
		limit: number
		nextCursor: string | null
	}
}
