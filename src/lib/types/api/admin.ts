// ─── Admin routes ──────────────────────────────────────

/** GET /api/admin/stats */
export type GetAdminStatsOutput = {
	totalUsers: number
	totalUsersPct: number
	activeStores: number
	activeStoresPct: number
	pendingApprovals: number
	totalProducts: number
	totalProductsPct: number
	messagesToday: number
}

/** GET /api/admin/analytics */
export type GetAdminAnalyticsInput = {
	days?: number
}

export type AdminAnalyticsDay = {
	date: string
	count: number
}

export type AdminTopStore = {
	id: string
	name: string
	slug: string
	created_at: string
	products: number
	followers: number
}

export type GetAdminAnalyticsOutput = {
	signupsByDay: AdminAnalyticsDay[]
	productsByDay: AdminAnalyticsDay[]
	storesByDay: AdminAnalyticsDay[]
	approvalRate: number
	topStores: AdminTopStore[]
}

/** GET /api/admin/users */
export type AdminUser = {
	id: string
	first_name: string | null
	last_name: string | null
	email: string | null
	phone_number: string | null
	avatar_url: string | null
	status: string
	created_at: string
	roles: string[]
	store: {
		id: string
		name: string
		slug: string
		status: string
	} | null
}

export type ListAdminUsersInput = {
	search?: string
	status?: string
	page?: number
	limit?: number
}

export type ListAdminUsersOutput = {
	users: AdminUser[]
}

/** GET /api/admin/users/[id] */
export type GetAdminUserOutput = {
	user: AdminUser
	store: {
		id: string
		name: string
		slug: string
		status: string
		logo_url: string | null
		banner_url: string | null
		description: string | null
		phone: string | null
		whatsapp: string | null
		email: string | null
		state: string
		created_at: string
		verified_at: string | null
	} | null
}

/** PATCH /api/admin/users/[id] */
export type AdminUpdateUserInput = {
	makeAdmin?: boolean
	removeAdmin?: boolean
	status?: string
}

export type AdminUpdateUserOutput = {
	success: true
}

/** DELETE /api/admin/users/[id] */
export type AdminDeleteUserOutput = {
	success: true
}

/** GET /api/admin/stores */
export type AdminStoreItem = {
	id: string
	name: string
	slug: string
	status: string
	description: string | null
	logo_url: string | null
	banner_url: string | null
	phone: string | null
	whatsapp: string | null
	email: string | null
	state: string
	created_at: string
	provinces: { name: string } | null
	categories: { id: string; name: string } | null
	users: {
		id: string
		first_name: string | null
		last_name: string | null
		email: string | null
		phone_number: string | null
		created_at: string
	} | null
	productCount: number
	followerCount: number
}

export type ListAdminStoresInput = {
	status?: string
	search?: string
	page?: number
	limit?: number
}

export type ListAdminStoresOutput = {
	stores: AdminStoreItem[]
}

/** GET /api/admin/stores/[id] */
export type AdminStoreDetail = AdminStoreItem & {
	followerCount: number
}

export type AdminVerificationDoc = {
	id: string
	type: string
	file_url: string
	status: string
	created_at: string
}

export type AdminStoreProduct = {
	id: string
	name: string
	slug: string
	price: number
	discount_price: number | null
	currency: string
	status: string
	is_visible: boolean
	created_at: string
	categories: { name: string } | null
	product_images: { url: string; is_primary: boolean }[]
}

export type GetAdminStoreOutput = {
	store: AdminStoreDetail
	docs: AdminVerificationDoc[]
	products: AdminStoreProduct[]
}

/** PATCH /api/admin/stores/[id] */
export type AdminUpdateStoreInput = {
	status?:
		| 'ACTIVE'
		| 'REJECTED'
		| 'PENDING'
		| 'INACTIVE'
		| 'SUSPENDED'
		| 'BANNED'
	rejectionReason?: string
	name?: string
	description?: string
	logo_url?: string
	banner_url?: string
	phone?: string
	whatsapp?: string
	email?: string
	state?: string
}

export type AdminUpdateStoreOutput = {
	store: AdminStoreDetail
}

/** DELETE /api/admin/stores/[id] */
export type AdminDeleteStoreOutput = {
	success: true
}

/** GET /api/admin/products */
export type AdminProductItem = {
	id: string
	name: string
	description: string | null
	price: number
	discount_price: number | null
	currency: string
	status: string
	is_visible: boolean
	created_at: string
	store_id: string
	category_id: string | null
	stores: { id: string; name: string; slug: string } | null
	categories: { id: string; name: string } | null
	product_images: { url: string; is_primary: boolean }[]
}

export type ListAdminProductsInput = {
	search?: string
	category?: string
	status?: string
	page?: number
	limit?: number
}

export type ListAdminProductsOutput = {
	products: AdminProductItem[]
}

/** PATCH /api/admin/products/[id] */
export type AdminUpdateProductInput = {
	name?: string
	description?: string
	price?: number
	discount_price?: number | null
	currency?: string
	status?: string
	is_visible?: boolean
	category_id?: string
}

export type AdminUpdateProductOutput = {
	success: true
}

/** DELETE /api/admin/products/[id] */
export type AdminDeleteProductOutput = {
	success: true
}
