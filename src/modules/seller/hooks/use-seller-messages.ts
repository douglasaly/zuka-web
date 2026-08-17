'use client'
import { useDeferredValue, useMemo, useState } from 'react'
import { flattenPages, useInfiniteList } from '@/hooks/use-infinite-list'
import type { SellerConversation } from '../ui/components/messages/seller-inbox-row'
export type SellerMessagesFilter = 'all' | 'unread'
export const SELLER_MESSAGES_SHELL =
	'-m-4 flex h-[calc(100dvh-76px)] min-w-0 flex-col sm:-m-6 lg:flex-row'
const INBOX_LIMIT = 20
export function useSellerMessages() {
	const [query, setQuery] = useState('')
	const deferredQuery = useDeferredValue(query)
	const [filter, setFilter] = useState<SellerMessagesFilter>('all')
	const {
		data,
		isLoading,
		isError,
		refetch,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteList<SellerConversation>({
		queryKey: ['seller-conversations'],
		endpoint: '/api/stores/conversations',
		limit: INBOX_LIMIT,
	})
	const conversations = flattenPages<SellerConversation>(data)
	const unreadCount = conversations.filter((c) => c.unread).length
	const visible = useMemo(() => {
		const q = deferredQuery.trim().toLowerCase()
		return conversations.filter((c) => {
			if (filter === 'unread' && !c.unread) return false
			if (!q) return true
			return (
				c.otherUserName.toLowerCase().includes(q) ||
				(c.lastMessage?.toLowerCase().includes(q) ?? false)
			)
		})
	}, [conversations, deferredQuery, filter])
	const clearFilters = () => {
		setQuery('')
		setFilter('all')
	}
	const showLoadMore =
		Boolean(hasNextPage) && filter === 'all' && !deferredQuery.trim()
	const subtitle = `${conversations.length}${hasNextPage ? '+' : ''} conversa${conversations.length === 1 ? '' : 's'}${
		unreadCount > 0
			? ` · ${unreadCount} não lida${unreadCount === 1 ? '' : 's'}`
			: ''
	}`
	return {
		query,
		setQuery,
		filter,
		setFilter,
		conversations,
		unreadCount,
		visible,
		clearFilters,
		showLoadMore,
		subtitle,
		isLoading,
		isError,
		refetch,
		fetchNextPage,
		isFetchingNextPage,
	}
}
