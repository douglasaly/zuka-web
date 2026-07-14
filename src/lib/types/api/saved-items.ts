// ─── Saved items routes ────────────────────────────────

export type SavedItem = {
	id: string
	imageUrl?: string | null
	name: string
	storeName: string
	price: number
	storeImage: string | null
	storeSlug: string
}

/** GET /api/saved-items */
export type ListSavedItemsOutput = {
	items: SavedItem[]
}

/** POST /api/saved-items/[id] */
export type SaveItemOutput = {
	success: true
	item: {
		id: string
		user_id: string
		product_id: string
		created_at: string
	}
}

/** DELETE /api/saved-items/[id] */
export type UnsaveItemOutput = undefined
