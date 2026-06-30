export interface FollowedStores {
	data: {
		followed_at: string | null
		store: {
			id: string
			name: string
			logo_url: string | null
			slug: string
			state: string
			verified_at: string | null
			province: {
				name: string
			}
		}
	}[]
	metaData: {
		total: number
		limit: number
		nextCursor: string | null
	}
}

export type StoreFollowItem = {
	followed_at: string | null
	store: {
		id: string
		name: string
		logo_url: string | null
		slug: string
		state: string
		verified_at: string | null
		province: {
			name: string
		}
	}
}

export type NormalizedStore = StoreFollowItem[]

export const normalizeStore = (item: StoreFollowItem) => ({
	id: item.store.id,
	imageUrl: item.store.logo_url,
	slug: item.store.slug,
	name: item.store.name,
	location: `${item.store.province.name} · ${item.store.state}`,
	verifiedAt: item.store.verified_at,
	verified: !!item.store.verified_at,
	followedAt: item.followed_at,
})
