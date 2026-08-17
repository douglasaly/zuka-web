export type AdminProduct = Record<string, unknown>
export const STATUS_FILTERS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'ACTIVE', label: 'Activos' },
	{ value: 'INACTIVE', label: 'Pausados' },
	{ value: 'DRAFT', label: 'Rascunhos' },
	{ value: 'PENDING_REVIEW', label: 'Em revisão' },
] as const
export const PRODUCT_STATUS_LABELS: Record<string, string> = {
	ACTIVE: 'Activo',
	INACTIVE: 'Pausado',
	DRAFT: 'Rascunho',
	PENDING_REVIEW: 'Em revisão',
	ARCHIVED: 'Arquivado',
}
