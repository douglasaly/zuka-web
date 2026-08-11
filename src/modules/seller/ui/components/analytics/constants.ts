import { Eye, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import type {
	AnalyticsRange,
	SellerAnalyticsMock,
} from '@/modules/seller/ui/components/analytics/mock-data'
import { formatPrice } from '@/utils/format-price'

export const RANGE_OPTIONS: { value: AnalyticsRange; label: string }[] = [
	{ value: '7d', label: '7 dias' },
	{ value: '30d', label: '30 dias' },
	{ value: '90d', label: '90 dias' },
]

export type KpiKey = keyof Omit<SellerAnalyticsMock, 'changes' | 'dailySales'>

export const KPI_CARDS: Array<{
	key: KpiKey
	icon: typeof TrendingUp
	label: string
	hint: string
	format: (v: number) => string
}> = [
	{
		key: 'totalSales',
		icon: TrendingUp,
		label: 'Vendas',
		hint: 'Valor dos pedidos no período',
		format: (v) => formatPrice(v),
	},
	{
		key: 'totalOrders',
		icon: ShoppingBag,
		label: 'Pedidos',
		hint: 'Pedidos recebidos no período',
		format: (v) => String(v),
	},
	{
		key: 'totalViews',
		icon: Eye,
		label: 'Vistas',
		hint: 'Vistas da loja e produtos',
		format: (v) => v.toLocaleString('pt-MZ'),
	},
	{
		key: 'productCount',
		icon: Package,
		label: 'Produtos activos',
		hint: 'À venda agora',
		format: (v) => String(v),
	},
	{
		key: 'totalFollowers',
		icon: Users,
		label: 'Seguidores',
		hint: 'Pessoas a seguir a loja',
		format: (v) => v.toLocaleString('pt-MZ'),
	},
]

export function formatChange(pct: number): string {
	const abs = Math.abs(pct).toFixed(1).replace('.', ',')
	if (pct > 0) return `+${abs}%`
	if (pct < 0) return `−${abs}%`
	return '0%'
}
