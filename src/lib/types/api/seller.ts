// ─── Seller routes ─────────────────────────────────────

export type SellerProduct = {
	id: string
	name: string
	price: number
	discountPrice: number | null
	currency: string
	status: string
	isVisible: boolean
	categoryName: string | null
	image: string | null
}

export type SellerStore = {
	id: string
	name: string
	slug: string
}

/** GET /api/seller/products */
export type ListSellerProductsInput = {
	search?: string
	status?: 'all' | 'DRAFT' | 'ACTIVE' | 'INACTIVE'
	category?: string
	page?: number
	limit?: number
}

export type ListSellerProductsOutput = {
	success: true
	products: SellerProduct[]
	store: SellerStore
	hasMore: boolean
	total: number
}

/** PATCH /api/seller/products/[id] */
export type UpdateSellerProductInput = {
	name?: string
	description?: string
	categoryId?: string
	price?: number
	discountPrice?: number | null
	quantity?: number
	status?: string
	isVisible?: boolean
	imageUrl?: string
}

export type UpdateSellerProductOutput = {
	success: true
}

/** DELETE /api/seller/products/[id] */
export type DeleteSellerProductOutput = {
	success: true
}

/** POST /api/seller/products/bulk */
export type BulkProductActionInput = {
	action: 'delete' | 'activate' | 'deactivate'
	ids: string[]
}

export type BulkProductActionOutput = {
	success: true
	affected: number
}

/** GET /api/seller/orders */
export type ListSellerOrdersInput = {
	status?: 'all' | 'PENDING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED'
	date?: string
	page?: number
	limit?: number
}

export type ListSellerOrdersOutput = {
	success: true
	orders: {
		id: string
		storeName: string
		storeAvatar: string | null
		date: string
		itemCount: number
		total: number
		currency: string
		status: string
		statusLabel: string
	}[]
	hasMore: boolean
	total: number
}

/** PATCH /api/seller/store */
export type UpdateSellerStoreInput = {
	logoUrl?: string
	bannerUrl?: string
	description?: string
	phone?: string
	whatsapp?: string
	hasDelivery?: boolean
	currentStep?: string
}

export type UpdateSellerStoreOutput = {
	success: true
	store: {
		id: string
		name: string
		slug: string
		logo_url: string | null
		banner_url: string | null
		description: string | null
		phone: string | null
		whatsapp: string | null
		status: string
	}
}

/** GET /api/seller/members */
export type StoreMember = {
	id: string
	role: string
	joinedAt: string | null
	invitedAt: string | null
	user: {
		id: string
		firstName: string | null
		lastName: string | null
		email: string | null
		avatarUrl: string | null
	}
}

export type ListSellerMembersOutput = {
	members: StoreMember[]
}

/** POST /api/seller/members */
export type InviteMemberInput = {
	userId?: string
	email?: string
	role?: string
}

export type InviteMemberOutput = {
	success: true
}

/** GET /api/seller/stats */
export type GetSellerStatsInput = {
	range?: number
}

export type GetSellerStatsOutput = {
	data: {
		totalSales: number
		totalSalesPrev: number
		totalSalesPct: number
		totalOrders: number
		totalOrdersPrev: number
		totalOrdersPct: number
		totalFollowers: number
		productCount: number
	}
}

/** GET /api/seller/stats/analytics */
export type GetSellerAnalyticsOutput = {
	data: {
		totalSales: number
		totalOrders: number
		totalViews: number
		totalFollowers: number
		averageTicket: number
		productCount: number
	}
}

/** GET /api/seller/unread-counts */
export type GetSellerUnreadCountsOutput = {
	pendingOrders: number
	unreadMessages: number
}
