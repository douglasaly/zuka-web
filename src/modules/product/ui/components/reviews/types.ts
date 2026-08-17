export type ProductReviewSort = 'recent' | 'highest' | 'lowest'
export type RatingSummary = {
	average: number
	count: number
	distribution: number[]
}
export type ProductReviewsProduct = {
	id: string
	name: string
	price: number
	discountPrice: number | null
	currency: string
	image: string | null
	categoryName: string | null
}
export type ProductReviewsStore = {
	id: string
	name: string
	slug: string
	avatarUrl: string | null
	verified: boolean
	rating: number | null
	reviewCount: number
}
export type PublicProductReview = {
	id: string
	reviewId: string
	orderId: string
	shortOrderId: string
	buyerName: string
	rating: number
	body: string | null
	createdAt: string
	storeReply: string | null
	storeRepliedAt: string | null
}
export type ProductReviewsResponse = {
	success: true
	product: ProductReviewsProduct
	store: ProductReviewsStore | null
	summary: RatingSummary
	reviews: PublicProductReview[]
	page: number
	perPage: number
	total: number
	totalPages: number
	hasMore: boolean
}
