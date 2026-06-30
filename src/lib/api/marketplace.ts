import {
	mapGroupedProduct,
	mapProductRow,
	mapStoreRow,
} from '@/lib/mappers/marketplace'
import type {
	OrderSummary,
	Product,
	StoreProfile,
	UserProfile,
} from '@/types/marketplace'

export const PRODUCT_PLACEHOLDER = '/product-placeholder.jpg'
export const STORE_PLACEHOLDER = '/placeholder.jpg'

type GroupedProduct = {
	product: Record<string, unknown>
	store?: Record<string, unknown> | null
	category?: Record<string, unknown> | null
	images: Array<Record<string, unknown>>
}

export async function fetchProducts(params?: {
	category?: string
	search?: string
	limit?: number
}) {
	const url = new URL('/api/products', window.location.origin)
	if (params?.category) url.searchParams.set('category', params.category)
	if (params?.search) url.searchParams.set('search', params.search)
	if (params?.limit) url.searchParams.set('limit', String(params.limit))

	const res = await fetch(url.toString())
	if (!res.ok) throw new Error('Failed to load products')

	const json = await res.json()
	const items = (json.products ?? []) as GroupedProduct[]
	return items.map((item) =>
		mapGroupedProduct({
			product: item.product,
			store: item.store ?? null,
			category: item.category ?? null,
			images: item.images,
		})
	)
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
	const url = new URL('/api/stores', window.location.origin)
	if (params?.search) url.searchParams.set('search', params.search)
	if (params?.limit) url.searchParams.set('limit', String(params.limit))

	const res = await fetch(url.toString())
	if (!res.ok) throw new Error('Failed to load stores')

	const json = await res.json()
	return (json.stores ?? []) as StoreProfile[]
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

export async function fetchOrders(): Promise<OrderSummary[]> {
	const res = await fetch('/api/orders', { credentials: 'include' })
	if (res.status === 401) {
		throw new Error('Unauthorized')
	}
	if (!res.ok) throw new Error('Failed to load orders')

	const json = await res.json()
	return (json.orders ?? []) as OrderSummary[]
}

export async function fetchOrder(id: string) {
	const res = await fetch(`/api/orders/${id}`, { credentials: 'include' })
	if (res.status === 404) return null
	if (!res.ok) throw new Error('Failed to load order')

	const json = await res.json()
	return json as {
		order: OrderSummary
		storeSlug: string | null
		items: Array<{
			id: string
			quantity: number
			unitPrice: number
			currency: string
			productName: string
			productSlug: string | null
		}>
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
	quantity?: number
	imageUrl?: string
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

	return json.product as Record<string, unknown>
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
	email?: string
	phone?: string
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

	return json.store as Record<string, unknown>
}

export async function updateSellerStore(input: {
	logoUrl?: string
	bannerUrl?: string
	description?: string
	phone?: string
	whatsapp?: string
	hasDelivery?: boolean
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

	return json.store as Record<string, unknown>
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

export function toProductCard(product: Product) {
	return {
		id: product.id,
		name: product.name,
		price: product.price,
		discountPrice: product.discountPrice,
		currency: product.currency,
		image: product.image ?? PRODUCT_PLACEHOLDER,
		hasDelivery: product.hasDelivery ?? false,
	}
}
