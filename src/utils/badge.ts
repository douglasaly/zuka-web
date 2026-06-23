type BadgeType = 'promo' | 'active' | 'hidden'

export const getBadge = (product: {
	discountPrice?: number | null
	price: number
	isVisible: boolean
	status: string
}): BadgeType => {
	if (!product.isVisible) return 'hidden'
	if (product.discountPrice && product.discountPrice < product.price)
		return 'promo'
	return 'active'
}
