import type { SellerProduct } from '@/types'
export const STATUS_OPTIONS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'ACTIVE', label: 'Activos' },
	{ value: 'INACTIVE', label: 'Pausados' },
	{ value: 'DRAFT', label: 'Rascunhos' },
] as const
export const PER_PAGE_OPTIONS = [5, 10, 25, 50, 100] as const
export const DEFAULT_PER_PAGE = 5
export type ProductsResponse = {
	products: SellerProduct[]
	total: number
	page: number
	perPage: number
	totalPages: number
	hasMore: boolean
}
