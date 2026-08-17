export const DESCRIPTION_MAX = 800
export const DELIVERY_ZONE_PRESETS = [
	{
		id: 'nationwide',
		label: 'Todo o país',
		exclusive: true,
	},
	{
		id: 'maputo',
		label: 'Cidade de Maputo',
		exclusive: false,
	},
	{
		id: 'matola',
		label: 'Matola',
		exclusive: false,
	},
	{
		id: 'marracuene',
		label: 'Marracuene',
		exclusive: false,
	},
] as const
export const NATIONWIDE_ZONE_LABEL = DELIVERY_ZONE_PRESETS[0].label
export const STATUS_OPTIONS = [
	{
		value: 'ACTIVE' as const,
		label: 'Activa',
		description: 'Visível no marketplace e a aceitar encomendas.',
	},
	{
		value: 'INACTIVE' as const,
		label: 'Pausada',
		description:
			'Oculta temporariamente. Pode reactivar a qualquer momento.',
	},
] as const
export const LOCKED_STATUS_LABELS: Record<string, string> = {
	PENDING: 'Pendente de aprovação',
	SUSPENDED: 'Suspensa',
	BANNED: 'Banida',
}
export const DOC_STATUS_LABELS: Record<string, string> = {
	PENDING: 'Em análise',
	APPROVED: 'Aprovado',
	REJECTED: 'Rejeitado',
}
export const DOC_STATUS_STYLES: Record<string, string> = {
	PENDING: 'bg-amber-500/10 text-amber-700',
	APPROVED: 'bg-emerald-500/10 text-emerald-700',
	REJECTED: 'bg-destructive/10 text-destructive',
}
