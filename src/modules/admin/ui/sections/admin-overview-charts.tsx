'use client'

import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import type { DayCount } from '@/modules/admin/ui/components/analytics/constants'

type AdminOverviewChartsProps = {
	analyticsLoading: boolean
	signups: DayCount[]
	products: DayCount[]
}

export function AdminOverviewCharts({
	analyticsLoading,
	signups,
	products,
}: AdminOverviewChartsProps) {
	return (
		<div className='grid gap-6 xl:grid-cols-2'>
			<div className='rounded-2xl border border-border/60 bg-card p-5'>
				<p className='mb-4 font-heading text-sm font-bold'>
					Novos registos — últimos 30 dias
				</p>
				{analyticsLoading ? (
					<Skeleton className='h-48 w-full rounded-xl' />
				) : (
					<ResponsiveContainer width='100%' height={200}>
						<LineChart
							data={signups}
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
								interval={4}
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
							<Line
								type='monotone'
								dataKey='count'
								stroke='#5C4AE4'
								strokeWidth={2}
								dot={false}
								name='Registos'
							/>
						</LineChart>
					</ResponsiveContainer>
				)}
			</div>

			<div className='rounded-2xl border border-border/60 bg-card p-5'>
				<p className='mb-4 font-heading text-sm font-bold'>
					Novos produtos — últimos 30 dias
				</p>
				{analyticsLoading ? (
					<Skeleton className='h-48 w-full rounded-xl' />
				) : (
					<ResponsiveContainer width='100%' height={200}>
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
								interval={4}
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
			</div>
		</div>
	)
}
