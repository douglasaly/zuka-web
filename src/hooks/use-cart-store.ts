'use client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { clampQuantity, effectivePrice } from '@/modules/cart/lib/cart-utils'
import type {
	Cart,
	CartActions,
	CartItem,
	CartProductInput,
	CartsState,
} from '@/types'

type CartStore = CartsState & CartActions
function dropEmptyCart(
	carts: Record<string, Cart>,
	storeId: string
): Record<string, Cart> {
	const { [storeId]: _removed, ...rest } = carts
	return rest
}
function upsertItem(
	items: CartItem[],
	next: CartItem
): {
	items: CartItem[]
	merged: boolean
} {
	const index = items.findIndex((item) => item.productId === next.productId)
	if (index < 0) {
		return { items: [...items, next], merged: false }
	}
	const current = items[index]
	const quantity = clampQuantity(current.quantity + next.quantity)
	const updated = items.map((item, i) =>
		i === index ? { ...item, quantity } : item
	)
	return { items: updated, merged: true }
}
export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			carts: {},
			hasHydrated: false,
			addItem: (product: CartProductInput, quantity = 1) => {
				const qty = clampQuantity(quantity)
				const storeId = product.storeId
				const existing = get().carts[storeId]
				const merged = Boolean(
					existing?.items.some(
						(item) => item.productId === product.id
					)
				)
				const now = Date.now()
				const nextItem: CartItem = {
					productId: product.id,
					name: product.name,
					image: product.image,
					quantity: qty,
					unitPrice: effectivePrice(product),
					currency: product.currency,
				}
				set((state) => {
					const cart = state.carts[storeId]
					if (!cart) {
						return {
							carts: {
								...state.carts,
								[storeId]: {
									storeId,
									storeName: product.storeName,
									storeSlug: product.storeSlug,
									storeAvatar: product.storeAvatar,
									items: [nextItem],
									updatedAt: now,
								},
							},
						}
					}
					const result = upsertItem(cart.items, nextItem)
					return {
						carts: {
							...state.carts,
							[storeId]: {
								...cart,
								storeName: product.storeName,
								storeSlug: product.storeSlug,
								storeAvatar: product.storeAvatar,
								items: result.items,
								updatedAt: now,
							},
						},
					}
				})
				return { storeId, merged }
			},
			removeItem: (storeId, productId) => {
				set((state) => {
					const cart = state.carts[storeId]
					if (!cart) return state
					const items = cart.items.filter(
						(item) => item.productId !== productId
					)
					if (items.length === 0) {
						return { carts: dropEmptyCart(state.carts, storeId) }
					}
					return {
						carts: {
							...state.carts,
							[storeId]: {
								...cart,
								items,
								updatedAt: Date.now(),
							},
						},
					}
				})
			},
			updateQuantity: (storeId, productId, quantity) => {
				if (quantity < 1) {
					get().removeItem(storeId, productId)
					return
				}
				const qty = clampQuantity(quantity)
				set((state) => {
					const cart = state.carts[storeId]
					if (!cart) return state
					const items = cart.items.map((item) =>
						item.productId === productId
							? { ...item, quantity: qty }
							: item
					)
					return {
						carts: {
							...state.carts,
							[storeId]: {
								...cart,
								items,
								updatedAt: Date.now(),
							},
						},
					}
				})
			},
			clearCart: (storeId) => {
				set((state) => ({
					carts: dropEmptyCart(state.carts, storeId),
				}))
			},
			clearAll: () => set({ carts: {} }),
			getCartByStore: (storeId) => get().carts[storeId],
			applyCurrentPrice: (storeId, productId, unitPrice) => {
				set((state) => {
					const cart = state.carts[storeId]
					if (!cart) return state
					return {
						carts: {
							...state.carts,
							[storeId]: {
								...cart,
								items: cart.items.map((item) =>
									item.productId === productId
										? { ...item, unitPrice }
										: item
								),
								updatedAt: Date.now(),
							},
						},
					}
				})
			},
			markHydrated: () => set({ hasHydrated: true }),
		}),
		{
			name: 'zuka-carts',
			version: 1,
			storage: createJSONStorage(() => {
				if (typeof window === 'undefined') {
					return {
						getItem: () => null,
						setItem: () => {},
						removeItem: () => {},
					}
				}
				return localStorage
			}),
			partialize: (state) => ({ carts: state.carts }),
			onRehydrateStorage: () => (state) => {
				state?.markHydrated()
			},
		}
	)
)
