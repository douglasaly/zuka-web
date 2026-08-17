import type { Metadata } from 'next'
import { CartView } from '@/modules/cart/ui/views/cart-view'
export const metadata: Metadata = {
	title: 'Carrinho',
}
export default function CarrinhoPage() {
	return <CartView />
}
