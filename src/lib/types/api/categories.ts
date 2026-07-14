// ─── Category routes ───────────────────────────────────

export type Category = {
	id: string
	parent_id: string | null
	name: string
	slug: string
	created_at: string
	updated_at: string
}

/** GET /api/categories */
export type ListCategoriesOutput = {
	success: true
	data: Category[]
}

/** GET /api/admin/categories */
export type AdminListCategoriesOutput = {
	categories: Category[]
}

/** POST /api/admin/categories */
export type AdminCreateCategoryInput = {
	name: string
	slug?: string
}

export type AdminCreateCategoryOutput = {
	category: Category
}

/** PATCH /api/admin/categories */
export type AdminUpdateCategoryInput = {
	id: string
	name: string
	slug: string
}

export type AdminUpdateCategoryOutput = {
	success: true
}

/** DELETE /api/admin/categories */
export type AdminDeleteCategoryInput = {
	id: string
}

export type AdminDeleteCategoryOutput = {
	success: true
}
