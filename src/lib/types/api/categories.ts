export type Category = {
	id: string
	parent_id: string | null
	name: string
	slug: string
	created_at: string
	updated_at: string
}
export type ListCategoriesOutput = {
	success: true
	data: Category[]
}
export type AdminListCategoriesOutput = {
	categories: Category[]
}
export type AdminCreateCategoryInput = {
	name: string
	slug?: string
}
export type AdminCreateCategoryOutput = {
	category: Category
}
export type AdminUpdateCategoryInput = {
	id: string
	name: string
	slug: string
}
export type AdminUpdateCategoryOutput = {
	success: true
}
export type AdminDeleteCategoryInput = {
	id: string
}
export type AdminDeleteCategoryOutput = {
	success: true
}
