export type SavedItem = {
	id: string
	imageUrl?: string | null
	name: string
	storeName: string
	price: number
	storeImage: string | null
	storeSlug: string
}
export type ListSavedItemsOutput = {
	items: SavedItem[]
}
export type SaveItemOutput = {
	success: true
	item: {
		id: string
		user_id: string
		product_id: string
		created_at: string
	}
}
export type UnsaveItemOutput = undefined
