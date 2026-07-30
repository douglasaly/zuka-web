import type { ProductStatusValue } from './constants'

export type ProductFormState = {
	name: string
	description: string
	categoryId: string
	price: string
	discountPrice: string
	quantity: string
	status: ProductStatusValue
	imageUrls: string[]
}

export const EMPTY_PRODUCT_FORM: ProductFormState = {
	name: '',
	description: '',
	categoryId: '',
	price: '',
	discountPrice: '',
	quantity: '1',
	status: 'ACTIVE',
	imageUrls: [],
}
