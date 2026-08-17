import type { Metadata } from 'next'
import { noIndexRobots } from '@/lib/seo/metadata'
import { CartView } from '@/modules/cart/ui/views/cart-view'

export const metadata: Metadata = {
	title: 'Carrinho',
	robots: noIndexRobots,
}
export default function CarrinhoPage() {
	return <CartView />
}
