'use client'

import { useEffect, useRef } from 'react'
import { useUnreadCounts } from './use-unread-counts'

function canNotify(): boolean {
	if (typeof Notification === 'undefined') return false
	if (Notification.permission === 'granted') return true
	if (Notification.permission === 'denied') return false
	Notification.requestPermission()
	return false
}

export function useNotificationPush() {
	const prev = useRef({ pendingOrders: 0, unreadMessages: 0 })
	const { data } = useUnreadCounts()

	useEffect(() => {
		if (!data || !canNotify()) {
			prev.current = { pendingOrders: 0, unreadMessages: 0 }
			return
		}

		const curr = prev.current

		if (data.pendingOrders > curr.pendingOrders) {
			new Notification('Novo pedido recebido', {
				body: `Tem ${data.pendingOrders} pedido${data.pendingOrders > 1 ? 's' : ''} pendente${data.pendingOrders > 1 ? 's' : ''}.`,
				icon: '/favicon.ico',
			})
		}

		if (data.unreadMessages > curr.unreadMessages) {
			new Notification('Nova mensagem', {
				body: `Tem ${data.unreadMessages} mensagen${data.unreadMessages > 1 ? 'ns' : 'm'} não lida${data.unreadMessages > 1 ? 's' : ''}.`,
				icon: '/favicon.ico',
			})
		}

		prev.current = data
	}, [data])
}
