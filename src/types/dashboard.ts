export type SellerStatData = {
	id: string
	icon: 'trending' | 'package' | 'whatsapp' | 'phone' | 'users' | 'eye'
	value: string
	label: string
	change?: number
}

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
		whatsappContacts: number
		whatsappContactsPct: number
		callContacts: number
		callContactsPct: number
		totalFollowers: number
		productCount: number
	}
}
export type GetSellerAnalyticsOutput = {
	success: true
	mock: true
	range: '7d' | '30d' | '90d'
	data: {
		totalSales: number
		totalOrders: number
		totalViews: number
		totalFollowers: number
		productCount: number
		changes: {
			totalSales: number
			totalOrders: number
			totalViews: number
			totalFollowers: number
			productCount: number
		}
		dailySales: Array<{
			date: string
			sales: number
		}>
	}
}

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
