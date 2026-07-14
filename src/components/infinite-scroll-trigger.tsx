'use client'

import { useEffect, useRef } from 'react'

interface InfiniteScrollTriggerProps {
	hasMore: boolean
	isLoading: boolean
	onLoadMore: () => void
	/** Distância em px do fundo para trigger. Default: 200 */
	margin?: number
	className?: string
}

/**
 * Componente que detecta quando o utilizador chegou perto do fim
 * e dispara onLoadMore para carregar mais itens.
 *
 * @example
 * <InfiniteScrollTrigger
 *   hasMore={hasNextPage}
 *   isLoading={isFetchingNextPage}
 *   onLoadMore={() => fetchNextPage()}
 * />
 */
export function InfiniteScrollTrigger({
	hasMore,
	isLoading,
	onLoadMore,
	margin = 200,
	className,
}: InfiniteScrollTriggerProps) {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasMore && !isLoading) {
					onLoadMore()
				}
			},
			{ rootMargin: `${margin}px` }
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [hasMore, isLoading, onLoadMore, margin])

	if (!hasMore) return null

	return (
		<div
			ref={ref}
			className={className}
			style={{ minHeight: 1 }}
			aria-hidden='true'
		/>
	)
}
