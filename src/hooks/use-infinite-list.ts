'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

// ─── Types ──────────────────────────────────────────────

type ApiResponse<T> = {
	success: boolean
	data: T[]
	pagination: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
	}
}

export type InfiniteListOptions<_T> = {
	/** Chave do query cache. Ex: ['conversations'] */
	queryKey: string[]
	/** Endpoint da API. Ex: '/api/conversations' */
	endpoint: string
	/** Número de itens por página. Default: 20 */
	limit?: number
	/** Parâmetros extra de query string */
	extraParams?: Record<string, string>
	/** Transformar cada item retornado */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- select transforma o tipo do query result
	select?: (data: any) => any
	/** Habilitar o query. Default: true */
	enabled?: boolean
	/** Intervalo de refetch em ms. Default: sem refetch automático */
	refetchInterval?: number
}

// ─── Hook ───────────────────────────────────────────────

/**
 * Hook genérico para listas infinitas com cursor-based pagination.
 *
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteList({
 *   queryKey: ['conversations'],
 *   endpoint: '/api/conversations',
 *   limit: 20,
 * })
 *
 * // data.pages = [{ data: [...], pagination: { hasMore, nextCursor } }, ...]
 * // items all flattened:
 * const allItems = data?.pages.flatMap(p => p.data) ?? []
 */
export function useInfiniteList<T>({
	queryKey,
	endpoint,
	limit = 20,
	extraParams,
	select,
	enabled = true,
	refetchInterval,
}: InfiniteListOptions<T>) {
	const queryFn = useCallback(
		async ({ pageParam }: { pageParam: string | null }) => {
			const url = new URL(endpoint, window.location.origin)
			url.searchParams.set('limit', String(limit))

			if (pageParam) {
				url.searchParams.set('cursor', pageParam)
			}

			if (extraParams) {
				for (const [key, value] of Object.entries(extraParams)) {
					url.searchParams.set(key, value)
				}
			}

			const res = await fetch(url.toString(), { credentials: 'include' })
			if (!res.ok) throw new Error('Failed to fetch')

			const json: ApiResponse<T> = await res.json()
			return json
		},
		[endpoint, limit, extraParams]
	)

	return useInfiniteQuery({
		queryKey,
		queryFn,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.hasMore
				? lastPage.pagination.nextCursor
				: undefined,
		initialPageParam: null as string | null,
		enabled,
		refetchInterval,
		select: select
			? (data) => ({
					...data,
					pages: data.pages.map((page) => ({
						...page,
						data: select(page.data),
					})),
				})
			: undefined,
	})
}

/** Flatten todas as páginas num array simples. */
export function flattenPages<T>(
	data: { pages: { data: T[] }[] } | undefined
): T[] {
	return data?.pages.flatMap((page) => page.data) ?? []
}
