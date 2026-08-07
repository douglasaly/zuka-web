import type {
	SellerStoreDetail,
	SellerStoreDocument,
} from '@/lib/types/api/seller'

type DocumentRow = {
	id: string
	type: string
	status: string
	file_url: string
	back_file_url: string | null
	rejection_reason: string | null
	reviewed_at: string | null
	created_at: string | null
	metadata: string | null
}

type StoreRow = {
	id: string
	name: string
	slug: string
	description: string | null
	logo_url: string | null
	banner_url: string | null
	phone: string | null
	whatsapp: string | null
	email: string | null
	province_id: string | null
	state: string
	status: string | null
	verified_at: string | null
	has_delivery?: boolean | null
	delivery_zones?: string[] | null
	provinces?: { name: string } | { name: string }[] | null
}

function parseDocumentKind(metadata: string | null): string | null {
	if (!metadata) return null
	try {
		const parsed = JSON.parse(metadata) as { kind?: string }
		return parsed.kind ?? null
	} catch {
		return null
	}
}

export function mapStoreDocument(row: DocumentRow): SellerStoreDocument {
	return {
		id: row.id,
		type: row.type,
		status: row.status as SellerStoreDocument['status'],
		fileUrl: row.file_url,
		backFileUrl: row.back_file_url,
		rejectionReason: row.rejection_reason,
		reviewedAt: row.reviewed_at,
		createdAt: row.created_at,
		kind: parseDocumentKind(row.metadata),
	}
}

export function mapSellerStoreDetail(
	store: StoreRow,
	productCount: number,
	documents: DocumentRow[]
): SellerStoreDetail {
	const province = Array.isArray(store.provinces)
		? store.provinces[0]
		: store.provinces

	return {
		id: store.id,
		name: store.name,
		slug: store.slug,
		description: store.description,
		logoUrl: store.logo_url,
		bannerUrl: store.banner_url,
		phone: store.phone,
		whatsapp: store.whatsapp,
		email: store.email,
		provinceId: store.province_id,
		provinceName: province?.name ?? null,
		neighborhood: store.state ?? '',
		status: store.status ?? 'PENDING',
		verifiedAt: store.verified_at,
		productCount,
		hasDelivery: Boolean(store.has_delivery),
		deliveryZones: store.delivery_zones ?? [],
		documents: documents.map(mapStoreDocument),
	}
}
