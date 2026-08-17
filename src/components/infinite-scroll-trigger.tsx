'use client'
import { useEffect, useRef } from 'react'

interface InfiniteScrollTriggerProps {
	hasMore: boolean
	isLoading: boolean
	onLoadMore: () => void
	margin?: number
	className?: string
}
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
