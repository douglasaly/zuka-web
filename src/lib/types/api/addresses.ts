// ─── Address routes ────────────────────────────────────

export type Address = {
	id: string
	userId: string
	label: string
	street: string
	neighborhood: string
	city: string
	provinceName: string | null
	phone: string
	recipientName: string
	isDefault: boolean
	createdAt: string
	updatedAt: string
}

/** GET /api/addresses */
export type ListAddressesOutput = {
	success: true
	addresses: Address[]
}

/** POST /api/addresses */
export type CreateAddressInput = {
	label: string
	street: string
	neighborhood: string
	city: string
	provinceSlug?: string
	phone: string
	recipientName: string
	isDefault?: boolean
}

export type CreateAddressOutput = {
	success: true
	address: Address
}

/** PATCH /api/addresses/[id] */
export type UpdateAddressInput = {
	label?: string
	street?: string
	neighborhood?: string
	city?: string
	provinceSlug?: string
	isDefault?: boolean
}

export type UpdateAddressOutput = {
	success: true
	address: Address
}

/** DELETE /api/addresses/[id] */
export type DeleteAddressOutput = {
	success: true
}
