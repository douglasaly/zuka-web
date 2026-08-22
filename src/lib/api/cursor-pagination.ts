/** Composite cursor for stable DESC pagination on (created_at, id). */
export function encodeCreatedAtIdCursor(createdAt: string, id: string): string {
	return `${createdAt}|${id}`
}

export function parseCreatedAtIdCursor(
	cursor: string
): { createdAt: string; id: string } | null {
	const sep = cursor.lastIndexOf('|')
	if (sep <= 0) return null
	const createdAt = cursor.slice(0, sep)
	const id = cursor.slice(sep + 1)
	if (!createdAt || !id) return null
	return { createdAt, id }
}

function quotePostgrestValue(value: string): string {
	if (/[,.:()]/.test(value)) {
		return `"${value.replace(/"/g, '""')}"`
	}
	return value
}

/** PostgREST filter: rows strictly before cursor in (created_at DESC, id DESC) order. */
export function createdAtIdCursorFilter(cursor: string): string {
	const parsed = parseCreatedAtIdCursor(cursor)
	if (!parsed) {
		return `created_at.lt.${quotePostgrestValue(cursor)}`
	}
	const createdAt = quotePostgrestValue(parsed.createdAt)
	const id = quotePostgrestValue(parsed.id)
	return `created_at.lt.${createdAt},and(created_at.eq.${createdAt},id.lt.${id})`
}
