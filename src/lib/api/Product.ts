export interface Product {
	id: string
	name: string
	price: number
	discountPrice?: number | null
	currency: string
	image?: string
	hasDelivery?: boolean
}
