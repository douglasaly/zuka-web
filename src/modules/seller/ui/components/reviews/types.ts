export type ReviewScope = 'store' | 'product'

export type RatingSummary = {
	average: number
	count: number
	distribution: number[]
}

export type StoreReviewProduct = {
	id: string
	productId: string
	productName: string
	productImage: string | null
	rating: number
	body: string | null
	createdAt: string
}

export type SellerStoreReview = {
	id: string
	orderId: string
	shortOrderId: string
	buyerName: string
	rating: number
	body: string | null
	storeReply: string | null
	storeRepliedAt: string | null
	createdAt: string
	products: StoreReviewProduct[]
}

export type SellerProductReview = {
	id: string
	reviewId: string
	orderId: string
	shortOrderId: string
	buyerName: string
	productId: string
	productName: string
	productImage: string | null
	rating: number
	body: string | null
	createdAt: string
	storeReply: string | null
}

export type SellerReviewsResponse = {
	success: true
	summary: {
		store: RatingSummary
		products: RatingSummary
	}
	storeReviews: SellerStoreReview[]
	productReviews: SellerProductReview[]
}
