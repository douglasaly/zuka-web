'use client'
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartCard } from '@/modules/admin/ui/components/analytics/chart-card'
import type { DayCount } from '@/modules/admin/ui/components/analytics/constants'
import { TopStoreRow } from '@/modules/admin/ui/components/analytics/top-store-row'

type AdminAnalyticsChartsProps = {
	days: number
	isLoading: boolean
	signups: DayCount[]
	products: DayCount[]
	stores: DayCount[]
	topStores: Record<string, unknown>[]
}
export function AdminAnalyticsCharts({
	days,
	isLoading,
	signups,
	products,
	stores,
	topStores,
}: AdminAnalyticsChartsProps) {
	return (
		<div className='grid gap-6 xl:grid-cols-2'>
			<ChartCard title={`Novos registos — ${days} dias`}>
				{isLoading ? (
					<Skeleton className='h-52 w-full rounded-xl' />
				) : (
					<ResponsiveContainer width='100%' height={210}>
						<AreaChart
							data={signups}
							margin={{
								top: 2,
								right: 4,
								bottom: 0,
								left: -20,
							}}
						>
							<defs>
								<linearGradient
									id='signupGrad'
									x1='0'
									y1='0'
									x2='0'
									y2='1'
								>
									<stop
										offset='5%'
										stopColor='#5C4AE4'
										stopOpacity={0.3}
									/>
									<stop
										offset='95%'
										stopColor='#5C4AE4'
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='hsl(var(--border))'
							/>
							<XAxis
								dataKey='date'
								tick={{ fontSize: 10 }}
								tickLine={false}
								axisLine={false}
								interval={Math.ceil(signups.length / 8)}
							/>
							<YAxis
								tick={{ fontSize: 10 }}
								tickLine={false}
								axisLine={false}
								allowDecimals={false}
							/>
							<Tooltip
								contentStyle={{
									borderRadius: 8,
									fontSize: 12,
								}}
							/>
							<Area
								type='monotone'
								dataKey='count'
								stroke='#5C4AE4'
								strokeWidth={2}
								fill='url(#signupGrad)'
								name='Registos'
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</ChartCard>

			<ChartCard title={`Novos produtos — ${days} dias`}>
				{isLoading ? (
					<Skeleton className='h-52 w-full rounded-xl' />
				) : (
					<ResponsiveContainer width='100%' height={210}>
						<BarChart
							data={products}
							margin={{
								top: 2,
								right: 4,
								bottom: 0,
								left: -20,
							}}
						>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='hsl(var(--border))'
							/>
							<XAxis
								dataKey='date'
								tick={{ fontSize: 10 }}
								tickLine={false}
								axisLine={false}
								interval={Math.ceil(products.length / 8)}
							/>
							<YAxis
								tick={{ fontSize: 10 }}
								tickLine={false}
								axisLine={false}
								allowDecimals={false}
							/>
							<Tooltip
								contentStyle={{
									borderRadius: 8,
									fontSize: 12,
								}}
							/>
							<Bar
								dataKey='count'
								fill='#5C4AE4'
								radius={[4, 4, 0, 0]}
								name='Produtos'
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</ChartCard>

			<ChartCard title={`Novas lojas — ${days} dias`}>
				{isLoading ? (
					<Skeleton className='h-52 w-full rounded-xl' />
				) : (
					<ResponsiveContainer width='100%' height={210}>
						<BarChart
							data={stores}
							margin={{
								top: 2,
								right: 4,
								bottom: 0,
								left: -20,
							}}
						>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='hsl(var(--border))'
							/>
							<XAxis
								dataKey='date'
								tick={{ fontSize: 10 }}
								tickLine={false}
								axisLine={false}
								interval={Math.ceil(stores.length / 8)}
							/>
							<YAxis
								tick={{ fontSize: 10 }}
								tickLine={false}
								axisLine={false}
								allowDecimals={false}
							/>
							<Tooltip
								contentStyle={{
									borderRadius: 8,
									fontSize: 12,
								}}
							/>
							<Bar
								dataKey='count'
								fill='#A78BFA'
								radius={[4, 4, 0, 0]}
								name='Lojas'
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</ChartCard>

			<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
				<p className='border-b border-border/60 px-5 py-4 font-heading text-sm font-bold'>
					Top lojas
				</p>
				{isLoading ? (
					<div className='p-5 space-y-2'>
						{Array.from({ length: 5 }, (_, i) => (
							<Skeleton key={i} className='h-10 rounded-xl' />
						))}
					</div>
				) : topStores.length === 0 ? (
					<div className='py-10 text-center text-sm text-muted-foreground'>
						Sem dados
					</div>
				) : (
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-border/40'>
								<th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground'>
									Loja
								</th>
								<th className='px-4 py-2 text-right text-xs font-medium text-muted-foreground'>
									Produtos
								</th>
								<th className='px-4 py-2 text-right text-xs font-medium text-muted-foreground'>
									Seguidores
								</th>
								<th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground'>
									Criada
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-border/40'>
							{topStores.map((s) => (
								<TopStoreRow key={s.id as string} store={s} />
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	)
}
