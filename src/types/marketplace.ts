export interface ExploreProduct {
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
	storeId: string
	storeName: string
	storeSlug: string
	storeLocation: string
	storeRating?: number
	storeVerified?: boolean
	storeAvatar: string | null
	description: string
	categoryId: string
	categoryName?: string
}

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

export interface OrderSummary {
	id: string
	storeName: string
	storeAvatar: string | null
	date: string
	itemCount: number
	total: number
	currency: string
	status: 'shipping' | 'pending' | 'completed' | 'cancelled'
	statusLabel: string
}

export interface UserProfile {
	id: string
	email: string | null
	firstName: string | null
	lastName: string | null
	avatarUrl: string | null
	roles: string[]
	phoneNumber: string | null
	emailVerified: boolean | null
	phoneVerified: boolean | null
	sellerProfile: {
		id: string
		status: string
	} | null
	stores: Array<{
		id: string
		name: string
		slug: string
		status: string | null
		productCount: number
	}>
	onboarding: {
		status: string
		currentStep: string | null
	} | null
}
