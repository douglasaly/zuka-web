type SkuInput = {
	brand?: string
	productName: string
	attributes?: string[]
	sequence: number
}
const normalize = (value: string) =>
	value
		.toUpperCase()
		.replace(/\s+/g, '-')
		.replace(/[^A-Z0-9-]/g, '')
		.trim()
export function generateSku(input: SkuInput): string {
	const brand = input.brand ? normalize(input.brand) : null
	const product = normalize(input.productName)
	const attributes = input.attributes?.map(normalize).join('-') ?? ''
	const sequence = String(input.sequence).padStart(3, '0')
	const parts = [brand, product, attributes, sequence]
		.filter(Boolean)
		.join('-')
	return parts
}
