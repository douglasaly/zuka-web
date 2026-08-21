'use client'

import { useEffect, useRef } from 'react'
import { useBuyerUnreadSummary } from '@/hooks/use-buyer-unread-summary'
import { useUnreadCounts } from '@/hooks/use-unread-counts'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { useUserProfile } from '@/hooks/use-user-profile'
import {
	getBrowserNotificationPermission,
	pluralPt,
	showBrowserNotification,
} from '@/lib/notifications/browser'

function canPush(): boolean {
	return getBrowserNotificationPermission() === 'granted'
}

/**
 * Seller store alerts (pending orders / unread chat) + buyer inbox alerts.
 * Fires on first load when counts > 0 (dashboard/app open) and on later increases.
 * Never prompts for permission — that is settings-only (user gesture).
 */
export function useNotificationPush() {
	const { isAuthenticated, isSeller } = useUserProfile()
	useSellerStorePush(isAuthenticated && isSeller)
	useBuyerInboxPush(isAuthenticated)
}

function useSellerStorePush(enabled: boolean) {
	const primed = useRef(false)
	const prev = useRef({ pendingOrders: 0, unreadMessages: 0 })
	const { data } = useUnreadCounts({ enabled })
	const { preferences, isReady } = useUserPreferences()
	const prefs = preferences.seller.notifications

	useEffect(() => {
		if (!enabled || !data || !isReady) return

		const fire = (opts: {
			title: string
			body: string
			tag: string
			href: string
			onOpen: boolean
		}) => {
			showBrowserNotification({
				...opts,
				onlyWhenHidden: !opts.onOpen,
			})
		}

		const notifyOrders = (n: number, onOpen: boolean) => {
			if (!prefs.orders || n <= 0 || !canPush()) return
			fire({
				title: onOpen ? 'Pedidos pendentes' : 'Novo pedido recebido',
				body: `Tem ${n} ${pluralPt(n, 'pedido pendente', 'pedidos pendentes')}.`,
				tag: 'zuka-seller-orders',
				href: '/dashboard/seller/pedidos',
				onOpen,
			})
		}

		const notifyMessages = (n: number, onOpen: boolean) => {
			if (!prefs.messages || n <= 0 || !canPush()) return
			fire({
				title: onOpen ? 'Mensagens não lidas' : 'Nova mensagem',
				body: `Tem ${n} ${pluralPt(n, 'mensagem não lida', 'mensagens não lidas')}.`,
				tag: 'zuka-seller-messages',
				href: '/dashboard/seller/mensagens',
				onOpen,
			})
		}

		if (!primed.current) {
			notifyOrders(data.pendingOrders, true)
			notifyMessages(data.unreadMessages, true)
			prev.current = {
				pendingOrders: data.pendingOrders,
				unreadMessages: data.unreadMessages,
			}
			primed.current = true
			return
		}

		const prevCounts = prev.current
		if (data.pendingOrders > prevCounts.pendingOrders) {
			notifyOrders(data.pendingOrders, false)
		}
		if (data.unreadMessages > prevCounts.unreadMessages) {
			notifyMessages(data.unreadMessages, false)
		}

		prev.current = {
			pendingOrders: data.pendingOrders,
			unreadMessages: data.unreadMessages,
		}
	}, [enabled, data, isReady, prefs.orders, prefs.messages])
}

function useBuyerInboxPush(enabled: boolean) {
	const primed = useRef(false)
	const prev = useRef({
		orders: 0,
		messages: 0,
		promotions: 0,
	})
	const { data } = useBuyerUnreadSummary()
	const { preferences, isReady } = useUserPreferences()
	const prefs = preferences.buyer.notifications

	useEffect(() => {
		if (!enabled || !data || !isReady) return

		const orders = data.byType.order ?? 0
		const messages = data.byType.message ?? 0
		const promotions =
			(data.byType.promotion ?? 0) + (data.byType.offer ?? 0)

		const fire = (opts: {
			title: string
			body: string
			tag: string
			href: string
			onOpen: boolean
		}) => {
			showBrowserNotification({
				...opts,
				onlyWhenHidden: !opts.onOpen,
			})
		}

		const notifyOrders = (n: number, onOpen: boolean) => {
			if (!prefs.orders || n <= 0 || !canPush()) return
			fire({
				title: onOpen
					? 'Actualizações de pedidos'
					: 'Actualização de pedido',
				body: `Tem ${n} ${pluralPt(n, 'notificação de pedido', 'notificações de pedidos')}.`,
				tag: 'zuka-buyer-orders',
				href: '/notificacoes',
				onOpen,
			})
		}

		const notifyMessages = (n: number, onOpen: boolean) => {
			if (!prefs.messages || n <= 0 || !canPush()) return
			fire({
				title: onOpen ? 'Mensagens' : 'Nova mensagem',
				body: `Tem ${n} ${pluralPt(n, 'mensagem não lida', 'mensagens não lidas')}.`,
				tag: 'zuka-buyer-messages',
				href: '/notificacoes',
				onOpen,
			})
		}

		const notifyPromotions = (n: number, onOpen: boolean) => {
			if (!prefs.promotions || n <= 0 || !canPush()) return
			fire({
				title: onOpen ? 'Promoções e novidades' : 'Nova promoção',
				body: `Tem ${n} ${pluralPt(n, 'promoção ou oferta', 'promoções ou ofertas')}.`,
				tag: 'zuka-buyer-promotions',
				href: '/notificacoes',
				onOpen,
			})
		}

		if (!primed.current) {
			notifyOrders(orders, true)
			notifyMessages(messages, true)
			notifyPromotions(promotions, true)
			prev.current = { orders, messages, promotions }
			primed.current = true
			return
		}

		const p = prev.current
		if (orders > p.orders) notifyOrders(orders, false)
		if (messages > p.messages) notifyMessages(messages, false)
		if (promotions > p.promotions) notifyPromotions(promotions, false)

		prev.current = { orders, messages, promotions }
	}, [enabled, data, isReady, prefs.orders, prefs.messages, prefs.promotions])
}
