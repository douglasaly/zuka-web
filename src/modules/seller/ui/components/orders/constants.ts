export const STATUS_OPTIONS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'PENDING', label: 'Pendentes' },
	{ value: 'SHIPPING', label: 'Em envio' },
	{ value: 'COMPLETED', label: 'Entregues' },
	{ value: 'CANCELLED', label: 'Cancelados' },
] as const

export const DATE_OPTIONS = [
	{ value: 'all', label: 'Todo o período' },
	{ value: '7', label: 'Últimos 7 dias' },
	{ value: '30', label: 'Últimos 30 dias' },
	{ value: '90', label: 'Últimos 90 dias' },
] as const

export const PER_PAGE_OPTIONS = [10, 25, 50, 100] as const
export const DEFAULT_PER_PAGE = 10
