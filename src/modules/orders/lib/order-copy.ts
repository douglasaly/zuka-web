import { formatPrice } from '@/utils/format-price'
export function orderShortId(orderId: string) {
	return orderId.slice(0, 8).toUpperCase()
}
export function buyerOrderPath(orderId: string) {
	return `/feed/pedidos/${orderId}`
}
export function sellerOrderPath(orderId: string) {
	return `/dashboard/seller/pedidos/${orderId}`
}
export type OrderLineCopy = {
	name: string
	quantity: number
	unitPriceCents: number
	currency: string
}
function linesBlock(
	lines: OrderLineCopy[],
	totalCents: number,
	currency: string
) {
	const items = lines.map((line) => `- ${line.quantity}x ${line.name}`)
	return [...items, `Total: ${formatPrice(totalCents / 100, currency)}`].join(
		'\n'
	)
}
export function formatOrderChatMessage(input: {
	shortId: string
	lines: OrderLineCopy[]
	totalCents: number
	currency: string
}) {
	return [
		`Pedido #${input.shortId}`,
		linesBlock(input.lines, input.totalCents, input.currency),
	].join('\n')
}
export function whatsappHref(phone: string, text: string) {
	const digits = phone.replace(/\D/g, '')
	return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}
export function formatOrderWhatsAppMessage(input: {
	shortId: string
	storeName: string
	lines: OrderLineCopy[]
	totalCents: number
	currency: string
}) {
	return [
		`Olá! Acabei de criar o pedido #${input.shortId} na ${input.storeName}.`,
		linesBlock(input.lines, input.totalCents, input.currency),
	].join('\n')
}
