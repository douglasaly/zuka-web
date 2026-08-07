export type Category = {
	id: string
	parentId: string | null
	name: string
	slug: string
	position: number
}

export type CategoryForm = {
	id?: string
	name: string
	slug: string
	parentId: string
}

export const EMPTY_FORM: CategoryForm = {
	name: '',
	slug: '',
	parentId: '',
}
