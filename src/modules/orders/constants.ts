export const STATUS_FILTERS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'pending', label: 'Em processamento' },
	{ value: 'shipping', label: 'Em envio' },
	{ value: 'completed', label: 'Entregue' },
	{ value: 'cancelled', label: 'Cancelado' },
] as const
export const PERIOD_FILTERS = [
	{ value: 'all', label: 'Todo o período' },
	{ value: '7', label: 'Últimos 7 dias' },
	{ value: '30', label: 'Últimos 30 dias' },
	{ value: '90', label: 'Últimos 90 dias' },
] as const
