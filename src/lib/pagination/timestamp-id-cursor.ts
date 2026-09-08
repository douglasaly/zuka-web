const CURSOR_SEPARATOR = '|'

/** Encode a stable cursor from a timestamp column and row id. */
export function encodeTimestampIdCursor(
	timestamp: string | null | undefined,
	id: string
): string | null {
	if (!timestamp) return null
	return `${timestamp}${CURSOR_SEPARATOR}${id}`
}

/**
 * Apply keyset pagination for `(timestamp DESC, id DESC)` ordering.
 * Supports legacy cursors that contain only the timestamp.
 */
export function applyTimestampIdCursor<
	T extends {
		lt: (column: string, value: string) => T
		or: (filters: string) => T
	},
>(query: T, cursor: string | undefined, timestampColumn: string, idColumn: string): T {
	if (!cursor) return query

	const separatorIndex = cursor.indexOf(CURSOR_SEPARATOR)
	if (separatorIndex === -1) {
		return query.lt(timestampColumn, cursor)
	}

	const timestamp = cursor.slice(0, separatorIndex)
	const id = cursor.slice(separatorIndex + 1)
	if (!timestamp || !id) {
		return query.lt(timestampColumn, cursor)
	}

	return query.or(
		`${timestampColumn}.lt.${timestamp},and(${timestampColumn}.eq.${timestamp},${idColumn}.lt.${id})`
	)
}
