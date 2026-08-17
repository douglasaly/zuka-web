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
export type ListAddressesOutput = {
	success: true
	addresses: Address[]
}
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
export type DeleteAddressOutput = {
	success: true
}
