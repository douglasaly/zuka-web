/** Stores buyers may start or continue conversations with. */
export function isStoreContactable(store: {
	status: string | null
	deleted_at?: string | null
}): boolean {
	return !store.deleted_at && store.status === 'ACTIVE'
}
