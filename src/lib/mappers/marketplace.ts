import type { OrderSummary, Product, StoreProfile } from '@/types/marketplace'

type DbImage = {
	url: string
	is_primary?: boolean | null
	position?: number | null
}

type DbStore = {
	id: string
	name: string
	slug: string
	state?: string | null
	logo_url?: string | null
	banner_url?: string | null
	description?: string | null
	verified_at?: string | null
	status?: string | null
	phone?: string | null
	whatsapp?: string | null
	email?: string | null
	provinces?: { name: string } | null
}

type DbProduct = {
	id: string
	name: string
	price: number
	discount_price?: number | null
	currency?: string | null
	slug?: string | null
	description?: string | null
	status?: string | null
	category_id: string
	store_id: string
	created_at?: string | null
	stores?: DbStore | null
	categories?: { id: string; name: string; slug: string } | null
	product_images?: DbImage[] | null
}

/** Strip invalid or dev-only placeholder URLs so components fall back to local images. */
function sanitizeUrl(url: string | null | undefined): string | null {
	if (!url) return null
	if (url.startsWith('data:')) return null
	if (url.includes('via.placeholder.com')) return null
	return url
}

function pickPrimaryImage(images?: DbImage[] | null) {
	if (!images?.length) return null
	const primary = images.find((img) => img.is_primary) ?? images[0]
	return sanitizeUrl(primary?.url)
}

function storeLocation(store?: DbStore | null) {
	if (!store) return ''
	const province = store.provinces?.name ?? ''
	const neighborhood = store.state ?? ''
	return [province, neighborhood].filter(Boolean).join(' · ')
}

export function mapProductRow(row: DbProduct): Product {
	const store = row.stores
	const createdAt = row.created_at ? new Date(row.created_at) : null
	const isNew =
		createdAt != null &&
		Date.now() - createdAt.getTime() < 1000 * 60 * 60 * 24 * 14

	return {
		id: row.id,
		name: row.name,
		price: row.price,
		discountPrice: row.discount_price,
		currency: row.currency ?? 'MZN',
		image: pickPrimaryImage(row.product_images),
		slug: row.slug ?? null,
		negotiable: row.discount_price != null,
		hasDelivery: row.status === 'ACTIVE',
		isNew,
		storeId: row.store_id,
		storeName: store?.name ?? 'Loja',
		storeSlug: store?.slug ?? '',
		storeLocation: storeLocation(store),
		storeVerified: Boolean(store?.verified_at),
		storeAvatar: store?.logo_url ?? sanitizeUrl(store?.logo_url),
		storePhone: store?.phone ?? null,
		description: row.description ?? '',
		categoryId: row.category_id,
		categoryName: row.categories?.name,
	}
}

export function mapGroupedProduct(item: {
	product: Record<string, unknown>
	store: Record<string, unknown> | null
	category: Record<string, unknown> | null
	images: Array<Record<string, unknown>>
}): Product {
	return mapProductRow({
		...(item.product as DbProduct),
		stores: item.store as DbStore,
		categories: item.category as DbProduct['categories'],
		product_images: item.images as DbImage[],
	})
}

export function mapStoreRow(
	store: DbStore & { product_count?: number; follower_count?: number }
): StoreProfile {
	return {
		id: store.id,
		name: store.name,
		slug: store.slug,
		location: store.provinces?.name ?? store.state ?? '',
		neighborhood: store.state ?? '',
		verified: Boolean(store.verified_at) || store.status === 'ACTIVE',
		rating: 4.8,
		reviewCount: 0,
		followers: store.follower_count ?? 0,
		productCount: store.product_count ?? 0,
		bannerUrl: store.banner_url ?? sanitizeUrl(store.banner_url),
		logoUrl: store.logo_url ?? sanitizeUrl(store.logo_url),
		whatsapp: store.whatsapp ?? store.phone ?? null,
		phone: store.phone ?? null,
		about: store.description ?? '',
		email: store.email ?? null,
		status: store.status ?? null,
	}
}

const orderStatusMap = {
	PENDING: { status: 'pending' as const, label: 'Pendente' },
	SHIPPING: { status: 'shipping' as const, label: 'A caminho' },
	COMPLETED: { status: 'completed' as const, label: 'Concluído' },
	CANCELLED: { status: 'cancelled' as const, label: 'Cancelado' },
}

export function mapOrderRow(order: {
	id: string
	total: number
	currency: string
	item_count: number
	status: string
	created_at: string
	stores?: { name: string; logo_url?: string | null } | null
}): OrderSummary {
	const mapped =
		orderStatusMap[order.status as keyof typeof orderStatusMap] ??
		orderStatusMap.PENDING

	return {
		id: order.id,
		storeName: order.stores?.name ?? 'Loja',
		storeAvatar:
			order.stores?.logo_url ?? sanitizeUrl(order.stores?.logo_url),
		date: new Date(order.created_at).toLocaleDateString('pt-PT', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}),
		itemCount: order.item_count,
		total: order.total,
		currency: order.currency,
		status: mapped.status,
		statusLabel: mapped.label,
	}
}
