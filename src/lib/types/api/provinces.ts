// ─── Province routes ───────────────────────────────────

export type Province = {
	id: string
	name: string
	slug: string
	created_at: string
	updated_at: string
}

/** GET /api/provinces */
export type ListProvincesOutput = Province[]
