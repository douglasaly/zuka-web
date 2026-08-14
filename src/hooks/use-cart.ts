'use client'

import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { cartsItemCount } from '@/modules/cart/lib/cart-utils'
import { useCartStore } from './use-cart-store'

export const useCartByStore = (storeId: string) =>
	useCartStore((s) => s.carts[storeId])

export const useCartItemCount = () =>
	useCartStore((s) => cartsItemCount(Object.values(s.carts)))

export const useCartList = () =>
	useCartStore(
		useShallow((s) =>
			Object.values(s.carts).sort((a, b) => b.updatedAt - a.updatedAt)
		)
	)

export function useHasHydrated() {
	const persistHydrated = useCartStore((s) => s.hasHydrated)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		if (useCartStore.persist.hasHydrated()) {
			useCartStore.getState().markHydrated()
		}
	}, [])

	return mounted && persistHydrated
}

export function useCart() {
	const addItem = useCartStore((s) => s.addItem)
	const removeItem = useCartStore((s) => s.removeItem)
	const updateQuantity = useCartStore((s) => s.updateQuantity)
	const clearCart = useCartStore((s) => s.clearCart)
	const clearAll = useCartStore((s) => s.clearAll)
	const getCartByStore = useCartStore((s) => s.getCartByStore)
	const applyCurrentPrice = useCartStore((s) => s.applyCurrentPrice)

	return {
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		clearAll,
		getCartByStore,
		applyCurrentPrice,
	}
}
