export interface StoreProfile {
	id: string
	name: string
	slug: string
	location: string
	neighborhood: string
	verified: boolean
	rating: number
	reviewCount: number
	followers: number
	productCount: number
	bannerUrl: string | null
	logoUrl: string | null
	whatsapp: string | null
	phone: string | null
	about: string
	email: string | null
	status: string | null
}

export type FollowedStore = {
	followedAt: string | null
	id: string
	name: string
	imageUrl: string | null
	slug: string
	verified: boolean
	verifiedAt: string | null
	location: string
}

export type StoreFollowItem = {
	followed_at: string | null
	store: {
		id: string
		name: string
		logo_url: string | null
		slug: string
		state: string
		verified_at: string | null
		province: {
			name: string
		}
	}
}

export interface FollowedStores {
	data: StoreFollowItem[]
	metaData: {
		total: number
		limit: number
		nextCursor: string | null
	}
}

export type NormalizedStore = StoreFollowItem[]

export type FollowedStoreItem = StoreFollowItem
export type ListFollowedStoresOutput = FollowedStores

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
	provinces: {
		name: string
		slug: string
	} | null
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
			provinces: {
				name: string
			} | null
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
			categories: {
				id: string
				name: string
			} | null
			product_images: {
				url: string
				is_primary: boolean
			}[]
		}[]
		page: number
		limit: number
	}
}
export type StoreProductItem = {
	id: string
	name: string
	slug: string
	price: number
	currency: string
	image: string | null
	category: {
		id: string
		name: string
	} | null
}
export type ListStoreProductsOutput = {
	success: true
	data: {
		store: {
			id: string
			name: string
			slug: string
		}
		products: StoreProductItem[]
	}
	metadata: {
		productCount: number
	}
	pagination: {
		nextCursor: string | null
		hasMore: boolean
		limit: number
	}
}
export type FollowStoreOutput = {
	success: true
	action: 'followed'
}
export type UnfollowStoreOutput = {
	success: true
	action: 'unfollowed'
}
export type IsFollowingOutput = {
	isFollowing: boolean
}
