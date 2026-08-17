export function shuffle<T>(array: T[]): T[] {
	const result = array.slice()
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}
export function shuffleWithStoreDiversity<T>(
	items: T[],
	getStoreId: (item: T) => string | undefined
): T[] {
	if (items.length <= 1) return items.slice()
	const byStore = new Map<string, T[]>()
	const orphan: T[] = []
	for (const item of items) {
		const storeId = getStoreId(item)
		if (!storeId) {
			orphan.push(item)
			continue
		}
		const bucket = byStore.get(storeId)
		if (bucket) bucket.push(item)
		else byStore.set(storeId, [item])
	}
	const queues = shuffle(
		[...byStore.values()].map((bucket) => shuffle(bucket))
	)
	const result: T[] = []
	while (queues.length > 0) {
		const next: T[][] = []
		for (const queue of queues) {
			const item = queue.shift()
			if (item !== undefined) result.push(item)
			if (queue.length > 0) next.push(queue)
		}
		queues.length = 0
		queues.push(...shuffle(next))
	}
	return result.concat(shuffle(orphan))
}
