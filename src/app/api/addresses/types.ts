export type Address = {
	id: string
	userId: string
	label: string
	street: string
	neighborhood: string
	city: string
	provinceId: string
	provinceName?: string
	isDefault: boolean
	createdAt: string
	updatedAt: string
}

export type CreateAddressInput = {
	label: string
	street: string
	neighborhood: string
	city: string
	provinceSlug: string
	isDefault?: boolean
}

export type UpdateAddressInput = Partial<CreateAddressInput>
