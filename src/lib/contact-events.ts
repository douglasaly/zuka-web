export type ContactEventType = 'whatsapp' | 'call'
export type ContactEventSource = 'product' | 'store'

export type TrackContactEventInput = {
	storeId: string
	productId?: string
	type: ContactEventType
	source: ContactEventSource
}

export function trackContactEvent(input: TrackContactEventInput) {
	const payload = JSON.stringify({
		storeId: input.storeId,
		productId: input.productId,
		type: input.type,
		source: input.source,
	})

	try {
		void fetch('/api/contact-events', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: payload,
			keepalive: true,
		})
	} catch {
		// Tracking must never block opening WhatsApp / tel:
	}
}
