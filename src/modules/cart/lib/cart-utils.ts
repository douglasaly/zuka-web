import type { Product } from '@/types/marketplace'
import {
	type Cart,
	type CartItem,
	type CartProductInput,
	MAX_CART_QUANTITY,
} from '../types'
export function effectivePrice(
	product: Pick<CartProductInput, 'price' | 'discountPrice'>
) {
	return product.discountPrice ?? product.price
}
export function clampQuantity(quantity: number) {
	if (!Number.isFinite(quantity)) return 1
	return Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(quantity)))
}
export function lineTotal(item: CartItem) {
	return item.unitPrice * item.quantity
}
export function cartTotal(cart: Cart) {
	return cart.items.reduce((sum, item) => sum + lineTotal(item), 0)
}
export function cartItemCount(cart: Cart) {
	return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}
export function cartsItemCount(carts: Cart[]) {
	return carts.reduce((sum, cart) => sum + cartItemCount(cart), 0)
}
export function cartsTotal(carts: Cart[]) {
	return carts.reduce((sum, cart) => sum + cartTotal(cart), 0)
}
export function cartCurrency(cart: Cart) {
	return cart.items[0]?.currency ?? 'MZN'
}
export function pricesDiffer(a: number, b: number) {
	return Math.round(a * 100) !== Math.round(b * 100)
}
export function toCartProductInput(product: Product): CartProductInput {
	return {
		id: product.id,
		name: product.name,
		image: product.image,
		currency: product.currency,
		price: product.price,
		discountPrice: product.discountPrice,
		storeId: product.storeId,
		storeName: product.storeName,
		storeSlug: product.storeSlug,
		storeAvatar: product.storeAvatar,
	}
}
export function buildCartWhatsAppMessage(cart: Cart) {
	const lines = cart.items.map((item) => `- ${item.quantity}x ${item.name}`)
	const total = cartTotal(cart)
	const currency = cartCurrency(cart)
	return [
		`Olá! Tenho interesse nestes produtos da ${cart.storeName}:`,
		...lines,
		`Total: ${Math.round(total)} ${currency}`,
	].join('\n')
}
