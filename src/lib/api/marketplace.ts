import {
	mapGroupedProduct,
	mapProductRow,
	mapStoreRow,
} from '@/lib/mappers/marketplace'
import type { CreatedBuyerOrder } from '@/modules/orders/types'
import type {
	OrderSummary,
	Product,
	StoreProfile,
	UserProfile,
} from '@/types/marketplace'

export const PRODUCT_PLACEHOLDER = '/product-placeholder.jpg'
export const STORE_PLACEHOLDER = '/placeholder.png'

type GroupedProduct = {
	product: Record<string, unknown>
	store?: Record<string, unknown> | null
	category?: Record<string, unknown> | null
	images: Array<Record<string, unknown>>
}

export async function fetchProducts(params?: {
	category?: string
	search?: string
	province?: string
	minPrice?: string
	maxPrice?: string
	isNew?: string
	sort?: string
	limit?: number
}) {
	const url = new URL(
		'/api/products',
		typeof window !== 'undefined' ? window.location.origin : ''
	)
	if (params?.category) url.searchParams.set('categoria', params.category)
	if (params?.search) url.searchParams.set('search', params.search)
	if (params?.province) url.searchParams.set('provincia', params.province)
	if (params?.minPrice) url.searchParams.set('preco_min', params.minPrice)
	if (params?.maxPrice) url.searchParams.set('preco_max', params.maxPrice)
	if (params?.isNew === 'true') url.searchParams.set('recente', 'true')
	if (params?.sort) url.searchParams.set('ordenar', params.sort)
	if (params?.limit) url.searchParams.set('limit', String(params.limit))

	const res = await fetch(url.toString())
	if (!res.ok) throw new Error('Failed to load products')

	const json = await res.json()
	// Suporta formato novo { success, data } e antigo { products }
	const items = (json.data ?? json.products ?? []) as GroupedProduct[]
	return items.map((item) =>
		mapGroupedProduct({
			product: item.product,
			store: item.store ?? null,
			category: item.category ?? null,
			images: item.images,
		})
	)
}

export type InfiniteProductsResponse = {
	data: Product[]
	pagination: { hasMore: boolean; nextCursor: string | null; limit: number }
}

export async function fetchProductsInfinite(params: {
	pageParam: string | null
	category?: string
	search?: string
	province?: string
	minPrice?: string
	maxPrice?: string
	isNew?: string
	sort?: string
	limit?: number
}): Promise<InfiniteProductsResponse> {
	const url = new URL(
		'/api/products',
		typeof window !== 'undefined' ? window.location.origin : ''
	)
	if (params.category) url.searchParams.set('categoria', params.category)
	if (params.search) url.searchParams.set('search', params.search)
	if (params.province) url.searchParams.set('provincia', params.province)
	if (params.minPrice) url.searchParams.set('preco_min', params.minPrice)
	if (params.maxPrice) url.searchParams.set('preco_max', params.maxPrice)
	if (params.isNew === 'true') url.searchParams.set('recente', 'true')
	if (params.sort) url.searchParams.set('ordenar', params.sort)
	url.searchParams.set('limit', String(params.limit ?? 50))
	if (params.pageParam) url.searchParams.set('cursor', params.pageParam)

	const res = await fetch(url.toString())
	if (!res.ok) throw new Error('Failed to load products')

	const json = await res.json()
	const items = (json.data ?? []) as GroupedProduct[]
	const mapped = items.map((item) =>
		mapGroupedProduct({
			product: item.product,
			store: item.store ?? null,
			category: item.category ?? null,
			images: item.images,
		})
	)
	return {
		data: mapped,
		pagination: json.pagination ?? {
			hasMore: false,
			nextCursor: null,
			limit: params.limit ?? 50,
		},
	}
}

export type InfiniteStoresResponse = {
	data: StoreProfile[]
	pagination: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
		total: number
		offset: number
	}
}

export async function fetchStoresInfinite(params: {
	pageParam: string | null
	search?: string
	limit?: number
}): Promise<InfiniteStoresResponse> {
	const url = new URL(
		'/api/stores',
		typeof window !== 'undefined' ? window.location.origin : ''
	)
	if (params.search) url.searchParams.set('search', params.search)
	url.searchParams.set('limit', String(params.limit ?? 50))
	if (params.pageParam) url.searchParams.set('offset', params.pageParam)

	const res = await fetch(url.toString())
	if (!res.ok) throw new Error('Failed to load stores')

	const json = await res.json()
	// A API já retorna StoreProfile[] via mapStoreRow
	const stores = (json.data?.stores ?? json.stores ?? []) as StoreProfile[]
	return {
		data: stores,
		pagination: json.data?.pagination ??
			json.pagination ?? {
				hasMore: false,
				nextCursor: null,
				limit: params.limit ?? 50,
				total: 0,
				offset: 0,
			},
	}
}

export async function fetchProduct(id: string) {
	const res = await fetch(`/api/products/${id}`)
	if (!res.ok) throw new Error('Failed to load product')

	const json = await res.json()
	const { product, store, category, images } = json.data as GroupedProduct

	return {
		product: mapProductRow({
			...(product as Parameters<typeof mapProductRow>[0]),
			stores: store as Parameters<typeof mapProductRow>[0]['stores'],
			categories: category as Parameters<
				typeof mapProductRow
			>[0]['categories'],
			product_images: images as Parameters<
				typeof mapProductRow
			>[0]['product_images'],
		}),
		images: (images ?? []).map((img) => String(img.url)),
	}
}

export async function fetchStores(params?: {
	search?: string
	limit?: number
}) {
	const url = new URL(
		'/api/stores',
		typeof window !== 'undefined' ? window.location.origin : ''
	)
	if (params?.search) url.searchParams.set('search', params.search)
	if (params?.limit) url.searchParams.set('limit', String(params.limit))

	const res = await fetch(url.toString())
	if (!res.ok) throw new Error('Failed to load stores')

	const json = await res.json()
	// A API já retorna StoreProfile[] via mapStoreRow — não re-mapear
	const stores = json.data?.stores ?? json.stores ?? []
	return stores as StoreProfile[]
}

export async function fetchStoreBySlug(slug: string) {
	const res = await fetch(`/api/stores/${slug}`)
	if (res.status === 404) return null
	if (!res.ok) throw new Error('Failed to load store')

	const json = await res.json()
	const { store, products } = json.data as {
		store: Record<string, unknown> & {
			provinces?: { name: string } | null
			product_count?: number
			follower_count?: number
		}
		products: GroupedProduct[]
	}

	return {
		store: mapStoreRow(store as Parameters<typeof mapStoreRow>[0]),
		products: products.map((item) =>
			mapGroupedProduct({
				product: item.product,
				store,
				category: item.category ?? null,
				images: item.images,
			})
		),
	}
}

export async function fetchOrders(): Promise<
	import('@/modules/orders/types').BuyerOrder[]
> {
	const res = await fetch('/api/orders', { credentials: 'include' })
	if (res.status === 401) {
		throw new Error('Unauthorized')
	}
	if (!res.ok) throw new Error('Failed to load orders')

	const json = await res.json()
	return (json.orders ?? []) as import('@/modules/orders/types').BuyerOrder[]
}

export async function createBuyerOrder(input: {
	storeId: string
	items: Array<{ productId: string; quantity: number }>
}): Promise<CreatedBuyerOrder> {
	const res = await fetch('/api/orders', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input),
	})
	const json = await res.json()
	if (!res.ok) {
		throw new Error(
			json.error?.message ?? 'Não foi possível criar o pedido.'
		)
	}
	return json.data as CreatedBuyerOrder
}

export async function fetchOrder(id: string) {
	const res = await fetch(`/api/orders/${id}`, { credentials: 'include' })
	if (res.status === 404) return null
	if (!res.ok) throw new Error('Failed to load order')

	const json = await res.json()
	return json as import('@/modules/orders/types').BuyerOrderDetail & {
		storeSlug: string | null
	}
}

export async function fetchSellerOrders(): Promise<OrderSummary[]> {
	const res = await fetch('/api/seller/orders', { credentials: 'include' })
	if (res.status === 401 || res.status === 403) return []
	if (!res.ok) throw new Error('Failed to load seller orders')

	const json = await res.json()
	return (json.orders ?? []) as OrderSummary[]
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
	const res = await fetch('/api/me/profile', { credentials: 'include' })
	if (res.status === 401) return null
	if (!res.ok) throw new Error('Failed to load profile')

	const json = await res.json()
	return json.profile as UserProfile
}

export interface SellerProduct {
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

export async function fetchSellerProducts() {
	const res = await fetch('/api/seller/products', { credentials: 'include' })
	if (!res.ok) {
		const json = await res.json().catch(() => ({}))
		throw new Error(json.error ?? 'Failed to load store products')
	}
	const json = await res.json()
	return (json.products ?? []) as SellerProduct[]
}

export async function createProduct(input: {
	name: string
	description?: string
	categoryId: string
	price: number
	discountPrice?: number
	imageUrl?: string
	imageUrls?: string[]
	status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE'
}) {
	const res = await fetch('/api/products', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input),
	})

	const json = await res.json()
	if (!res.ok) {
		throw new Error(json.error ?? 'Failed to create product')
	}

	return (json.data?.product ?? json.product) as Record<string, unknown>
}

export async function setOnboardingRole(role: 'buyer' | 'seller') {
	const res = await fetch('/api/onboarding/role', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ role }),
	})

	if (!res.ok) {
		const json = await res.json().catch(() => ({}))
		throw new Error(json.error ?? 'Failed to set role')
	}
}

export async function createStore(input: {
	name: string
	description?: string
	provinceId: string
	categoryId?: string
	neighborhood: string
	email: string
	phone: string
	whatsapp?: string
}) {
	const res = await fetch('/api/stores', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input),
	})

	const json = await res.json()
	if (!res.ok) {
		throw new Error(json.error ?? 'Failed to create store')
	}

	return (json.data?.store ?? json.store) as Record<string, unknown>
}

export async function updateSellerStore(input: {
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
}) {
	const res = await fetch('/api/seller/store', {
		method: 'PATCH',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input),
	})

	const json = await res.json()
	if (!res.ok) {
		throw new Error(json.error ?? 'Failed to update store')
	}

	return (json.store ?? json) as Record<string, unknown>
}

export async function submitVerification(input: {
	idCardUrl: string
	selfieUrl: string
}) {
	const res = await fetch('/api/onboarding/verification', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input),
	})

	const json = await res.json()
	if (!res.ok) {
		throw new Error(json.error ?? 'Failed to submit verification')
	}
}

export async function startConversation(productId: string) {
	const res = await fetch('/api/conversations', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ productId }),
	})
	if (!res.ok) throw new Error('Failed to start conversation')
	const { data } = await res.json()
	return data as { conversationId: string }
}
