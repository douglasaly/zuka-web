import type { Product } from './product'

export type CartProductInput = Pick<
	Product,
	| 'id'
	| 'name'
	| 'image'
	| 'currency'
	| 'price'
	| 'discountPrice'
	| 'storeId'
	| 'storeName'
	| 'storeSlug'
	| 'storeAvatar'
>
export type CartItem = {
	productId: string
	name: string
	image: string | null
	quantity: number
	unitPrice: number
	currency: string
}
export type Cart = {
	storeId: string
	storeName: string
	storeSlug: string
	storeAvatar: string | null
	items: CartItem[]
	updatedAt: number
}
export type CartsState = {
	carts: Record<string, Cart>
	hasHydrated: boolean
}
export type CartActions = {
	addItem: (
		product: CartProductInput,
		quantity?: number
	) => {
		storeId: string
		merged: boolean
	}
	removeItem: (storeId: string, productId: string) => void
	updateQuantity: (
		storeId: string,
		productId: string,
		quantity: number
	) => void
	clearCart: (storeId: string) => void
	clearAll: () => void
	getCartByStore: (storeId: string) => Cart | undefined
	applyCurrentPrice: (
		storeId: string,
		productId: string,
		unitPrice: number
	) => void
	markHydrated: () => void
}
export type ReconciledProduct = {
	productId: string
	currentPrice: number | null
	unavailable: boolean
	priceChanged: boolean
	storePhone: string | null
}
