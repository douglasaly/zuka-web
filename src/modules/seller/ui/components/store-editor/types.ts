import type { SellerStoreDetail } from '@/types'
export type StoreFormState = {
	name: string
	slug: string
	description: string
	logoUrl: string | null
	bannerUrl: string | null
	phone: string
	whatsapp: string
	email: string
	provinceId: string
	neighborhood: string
	status: 'ACTIVE' | 'INACTIVE'
	hasDelivery: boolean
	deliveryZones: string[]
	zoneDraft: string
}
export function storeToFormState(store: SellerStoreDetail): StoreFormState {
	const editableStatus =
		store.status === 'ACTIVE' || store.status === 'INACTIVE'
			? store.status
			: 'INACTIVE'
	return {
		name: store.name,
		slug: store.slug,
		description: store.description ?? '',
		logoUrl: store.logoUrl,
		bannerUrl: store.bannerUrl,
		phone: stripCountryCode(store.phone ?? ''),
		whatsapp: stripCountryCode(store.whatsapp ?? ''),
		email: store.email ?? '',
		provinceId: store.provinceId ?? '',
		neighborhood: store.neighborhood ?? '',
		status: editableStatus,
		hasDelivery: store.hasDelivery,
		deliveryZones: store.deliveryZones ?? [],
		zoneDraft: '',
	}
}
export function formatPhone(value: string) {
	const digits = value.replace(/\D/g, '')
	if (!digits) return ''
	if (digits.startsWith('258')) return `+${digits}`
	return `+258${digits}`
}
function stripCountryCode(value: string) {
	const digits = value.replace(/\D/g, '')
	if (digits.startsWith('258')) return digits.slice(3)
	return digits
}
