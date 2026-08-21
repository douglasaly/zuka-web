import type { StoreFollowItem } from '@/types/store'

export const normalizeStore = (item: StoreFollowItem) => ({
	id: item.store.id,
	imageUrl: item.store.logo_url,
	slug: item.store.slug,
	name: item.store.name,
	location: `${item.store.province.name} • ${item.store.state}`,
	verifiedAt: item.store.verified_at,
	verified: !!item.store.verified_at,
	followedAt: item.followed_at,
})
