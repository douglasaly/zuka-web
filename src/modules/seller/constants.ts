export type SellerStat = {
	id: string
	icon: 'trending' | 'package' | 'users' | 'eye'
	value: string
	label: string
}

export const MOCK_SELLER_STATS: SellerStat[] = [
	{
		id: 'sales',
		icon: 'trending',
		value: 'MZN 12,400',
		label: 'Vendas este mês',
	},
	{ id: 'orders', icon: 'package', value: '34', label: 'Pedidos' },
	{ id: 'followers', icon: 'users', value: '1,200', label: 'Seguidores' },
	{ id: 'views', icon: 'eye', value: '4,800', label: 'Visualizações' },
]

export type SellerProduct = {
	id: string
	name: string
	price: string
	imageUrl: string
}

export const MOCK_SELLER_PRODUCTS: SellerProduct[] = [
	{
		id: '1',
		name: 'Kit Cuidado Cabelo Natural',
		price: 'MZN 2,300',
		imageUrl: '/placeholder.jpg',
	},
	{
		id: '2',
		name: 'Perfume Africana Femme 50ml',
		price: 'MZN 1,800',
		imageUrl: '/placeholder.jpg',
	},
]
