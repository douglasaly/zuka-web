import type { ReactNode } from 'react'

export type SellerPageMeta = {
	title?: string | null
	crumbs?: string[] | null
	action?: ReactNode
}

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
	images: string[]
	description: string | null
}

export type SellerDashboardProduct = {
	id: string
	name: string
	price: string
	imageUrl: string
}

export type SellerStat = {
	id: string
	icon: 'trending' | 'package' | 'users' | 'eye'
	value: string
	label: string
}

export type SellerStore = {
	id: string
	name: string
	slug: string
}
export type ListSellerProductsInput = {
	search?: string
	status?: 'all' | 'DRAFT' | 'ACTIVE' | 'INACTIVE'
	category?: string
	minPrice?: number
	maxPrice?: number
	page?: number
	perPage?: number
	limit?: number
}
export type ListSellerProductsOutput = {
	success: true
	products: SellerProduct[]
	store: SellerStore
	page: number
	perPage: number
	total: number
	totalPages: number
	hasMore: boolean
}
export type UpdateSellerProductInput = {
	name?: string
	description?: string
	categoryId?: string
	price?: number
	discountPrice?: number | null
	status?: string
	isVisible?: boolean
	imageUrl?: string
	imageUrls?: string[]
}
export type SellerProductDetail = {
	id: string
	name: string
	description: string | null
	categoryId: string
	categoryName: string | null
	price: number
	discountPrice: number | null
	currency: string
	status: string
	isVisible: boolean
	images: Array<{
		id: string
		url: string
		position: number
		isPrimary: boolean
	}>
}
export type GetSellerProductOutput = {
	success: true
	product: SellerProductDetail
}
export type UpdateSellerProductOutput = {
	success: true
}
export type DeleteSellerProductOutput = {
	success: true
}
export type BulkProductActionInput = {
	action: 'delete' | 'activate' | 'deactivate'
	ids: string[]
}
export type BulkProductActionOutput = {
	success: true
	affected: number
}
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
export type SellerStoreDocument = {
	id: string
	type: string
	status: 'PENDING' | 'APPROVED' | 'REJECTED'
	fileUrl: string
	backFileUrl: string | null
	rejectionReason: string | null
	reviewedAt: string | null
	createdAt: string | null
	kind: string | null
}
export type SellerStoreDetail = {
	id: string
	name: string
	slug: string
	description: string | null
	logoUrl: string | null
	bannerUrl: string | null
	phone: string | null
	whatsapp: string | null
	email: string | null
	provinceId: string | null
	provinceName: string | null
	neighborhood: string
	status: string
	verifiedAt: string | null
	productCount: number
	hasDelivery: boolean
	deliveryZones: string[]
	documents: SellerStoreDocument[]
}
export type GetSellerStoreOutput = {
	success: true
	store: SellerStoreDetail
}
export type UpdateSellerStoreInput = {
	name?: string
	slug?: string
	logoUrl?: string | null
	bannerUrl?: string | null
	description?: string | null
	phone?: string | null
	whatsapp?: string | null
	email?: string | null
	provinceId?: string | null
	neighborhood?: string
	status?: 'ACTIVE' | 'INACTIVE'
	hasDelivery?: boolean
	deliveryZones?: string[]
	currentStep?: string
}
export type UpdateSellerStoreOutput = {
	success: true
	store: SellerStoreDetail
}
export type ResubmitStoreDocumentsInput = {
	idCardUrl: string
	selfieUrl: string
}
export type ResubmitStoreDocumentsOutput = {
	success: true
	documents: SellerStoreDocument[]
}
export type StoreMember = {
	id: string
	role: 'owner' | 'manager' | 'staff' | 'viewer' | string
	status: 'pending' | 'active' | 'removed' | string
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
export type StoreRoleCatalogEntry = {
	label: string
	summary: string
	permissions: string[]
}
export type ListSellerMembersOutput = {
	success?: true
	members: StoreMember[]
	me?: {
		userId: string
		memberRole: string
		rbacRole: string
		isOwner: boolean
		permissions: string[]
		canManage: boolean
	}
	roleCatalog?: Record<'manager' | 'staff' | 'viewer', StoreRoleCatalogEntry>
}
export type GetSellerAccessOutput = {
	success: true
	store: {
		id: string
		name: string
		slug: string
	}
	memberRole: string
	rbacRole: string
	isOwner: boolean
	permissions: string[]
	roleCatalog: Record<'manager' | 'staff' | 'viewer', StoreRoleCatalogEntry>
}
export type InviteMemberInput = {
	userId?: string
	email?: string
	role?: 'manager' | 'staff' | 'viewer' | string
}
export type InviteMemberOutput = {
	success: true
	revived?: boolean
}
export type GetSellerUnreadCountsOutput = {
	pendingOrders: number
	unreadMessages: number
}
