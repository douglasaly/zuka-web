'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchProduct } from '@/lib/api/marketplace'
import { effectivePrice, pricesDiffer } from '@/modules/cart/lib/cart-utils'
import type { ReconciledProduct } from '@/modules/cart/types'
import { useCartList } from './use-cart'

type FetchedProduct = {
	currentPrice: number
	storePhone: string | null
}

export function useCartReconcile() {
	const carts = useCartList()

	const snapshot = useMemo(() => {
		const unitPrices: Record<string, number> = {}
		const idSet = new Set<string>()
		for (const cart of carts) {
			for (const item of cart.items) {
				unitPrices[item.productId] = item.unitPrice
				idSet.add(item.productId)
			}
		}
		return { unitPrices, productIds: [...idSet].sort() }
	}, [carts])

	const query = useQuery({
		queryKey: ['cart-reconcile', snapshot.productIds],
		enabled: snapshot.productIds.length > 0,
		staleTime: 60_000,
		queryFn: async () => {
			const results = await Promise.allSettled(
				snapshot.productIds.map(async (id) => {
					const data = await fetchProduct(id)
					return { id, product: data.product }
				})
			)

			const fetched: Record<string, FetchedProduct> = {}
			const missing: string[] = []

			for (const result of results) {
				if (result.status !== 'fulfilled') continue
				const { id, product } = result.value
				fetched[id] = {
					currentPrice: effectivePrice(product),
					storePhone: product.storePhone,
				}
			}

			for (const id of snapshot.productIds) {
				if (!fetched[id]) missing.push(id)
			}

			return { fetched, missing }
		},
	})

	const byProductId = useMemo(() => {
		const map: Record<string, ReconciledProduct> = {}
		const fetched = query.data?.fetched ?? {}
		const missing = new Set(query.data?.missing ?? [])

		for (const id of snapshot.productIds) {
			const live = fetched[id]
			if (!live) {
				map[id] = {
					productId: id,
					currentPrice: null,
					unavailable: missing.has(id),
					priceChanged: false,
					storePhone: null,
				}
				continue
			}

			const snapshotPrice = snapshot.unitPrices[id]
			map[id] = {
				productId: id,
				currentPrice: live.currentPrice,
				unavailable: false,
				priceChanged:
					snapshotPrice != null &&
					pricesDiffer(snapshotPrice, live.currentPrice),
				storePhone: live.storePhone,
			}
		}

		return map
	}, [query.data, snapshot])

	return {
		byProductId,
		isLoading: query.isLoading,
		isFetching: query.isFetching,
	}
}
