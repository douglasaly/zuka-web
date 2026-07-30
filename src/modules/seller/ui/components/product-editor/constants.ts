export const PRODUCT_STATUS_OPTIONS = [
	{
		value: 'DRAFT' as const,
		label: 'Rascunho',
		description: 'Só visível para si. Ainda não aparece na loja.',
	},
	{
		value: 'ACTIVE' as const,
		label: 'Activo',
		description: 'Visível na loja e disponível para compra.',
	},
	{
		value: 'INACTIVE' as const,
		label: 'Pausado',
		description: 'Oculto temporariamente. Pode reactivar depois.',
	},
] as const

export type ProductStatusValue =
	(typeof PRODUCT_STATUS_OPTIONS)[number]['value']

export const PRODUCT_STATUS_STYLES: Record<string, string> = {
	DRAFT: 'bg-muted text-muted-foreground',
	ACTIVE: 'bg-emerald-500/10 text-emerald-700',
	INACTIVE: 'bg-amber-500/10 text-amber-700',
	PENDING_REVIEW: 'bg-blue-500/10 text-blue-700',
	ARCHIVED: 'bg-muted text-muted-foreground',
}

export const PRODUCT_STATUS_LABELS: Record<string, string> = {
	DRAFT: 'Rascunho',
	ACTIVE: 'Activo',
	INACTIVE: 'Pausado',
	PENDING_REVIEW: 'Em revisão',
	ARCHIVED: 'Arquivado',
}

export const MAX_PRODUCT_IMAGES = 8
