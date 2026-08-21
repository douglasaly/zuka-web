export type SellerStat = {
	id: string
	icon: 'trending' | 'package' | 'users' | 'eye'
	value: string
	label: string
}

export type SellerProduct = {
	id: string
	name: string
	price: string
	imageUrl: string
}