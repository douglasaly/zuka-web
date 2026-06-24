'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import {
	AreaChart,
	Area,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { KpiCard } from '../components/kpi-card'

const RANGES = [
	{ label: '7 dias', days: 7 },
	{ label: '30 dias', days: 30 },
	{ label: '90 dias', days: 90 },
]

async function fetchAnalytics(days: number) {
	const res = await fetch(`/api/admin/analytics?days=${days}`, { credentials: 'include' })
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function fetchStats() {
	const res = await fetch('/api/admin/stats', { credentials: 'include' })
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

function formatDay(date: string) {
	try {
		return format(new Date(date), 'd MMM', { locale: pt })
	} catch {
		return date
	}
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div className='rounded-2xl border border-border/60 bg-card p-5'>
			<p className='mb-4 font-heading text-sm font-bold'>{title}</p>
			{children}
		</div>
	)
}

export function AnalyticsView() {
	const [days, setDays] = useState(30)

	const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: fetchStats })
	const { data, isLoading } = useQuery({
		queryKey: ['admin-analytics', days],
		queryFn: () => fetchAnalytics(days),
	})

	const signups = (data?.signupsByDay ?? []).map((d: { date: string; count: number }) => ({ ...d, date: formatDay(d.date) }))
	const products = (data?.productsByDay ?? []).map((d: { date: string; count: number }) => ({ ...d, date: formatDay(d.date) }))
	const stores = (data?.storesByDay ?? []).map((d: { date: string; count: number }) => ({ ...d, date: formatDay(d.date) }))
	const topStores = data?.topStores ?? []

	return (
		<div className='space-y-8'>
			{/* Range picker */}
			<div className='flex gap-1'>
				{RANGES.map((r) => (
					<button
						key={r.days}
						type='button'
						onClick={() => setDays(r.days)}
						className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${days === r.days ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}
					>
						{r.label}
					</button>
				))}
			</div>

			{/* KPI Row */}
			<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				{statsLoading ? (
					Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className='h-28 rounded-2xl' />)
				) : (
					<>
						<KpiCard label='Total utilizadores' value={stats?.totalUsers ?? 0} />
						<KpiCard label='Lojas ativas' value={stats?.activeStores ?? 0} />
						<KpiCard label='Produtos listados' value={stats?.totalProducts ?? 0} />
						<KpiCard label='Taxa de aprovação' value={`${data?.approvalRate ?? 0}%`} />
					</>
				)}
			</div>

			{/* Charts */}
			<div className='grid gap-6 xl:grid-cols-2'>
				<ChartCard title={`Novos registos — ${days} dias`}>
					{isLoading ? <Skeleton className='h-52 w-full rounded-xl' /> : (
						<ResponsiveContainer width='100%' height={210}>
							<AreaChart data={signups} margin={{ top: 2, right: 4, bottom: 0, left: -20 }}>
								<defs>
									<linearGradient id='signupGrad' x1='0' y1='0' x2='0' y2='1'>
										<stop offset='5%' stopColor='#5C4AE4' stopOpacity={0.3} />
										<stop offset='95%' stopColor='#5C4AE4' stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
								<XAxis dataKey='date' tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={Math.ceil(signups.length / 8)} />
								<YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
								<Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
								<Area type='monotone' dataKey='count' stroke='#5C4AE4' strokeWidth={2} fill='url(#signupGrad)' name='Registos' />
							</AreaChart>
						</ResponsiveContainer>
					)}
				</ChartCard>

				<ChartCard title={`Novos produtos — ${days} dias`}>
					{isLoading ? <Skeleton className='h-52 w-full rounded-xl' /> : (
						<ResponsiveContainer width='100%' height={210}>
							<BarChart data={products} margin={{ top: 2, right: 4, bottom: 0, left: -20 }}>
								<CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
								<XAxis dataKey='date' tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={Math.ceil(products.length / 8)} />
								<YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
								<Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
								<Bar dataKey='count' fill='#5C4AE4' radius={[4, 4, 0, 0]} name='Produtos' />
							</BarChart>
						</ResponsiveContainer>
					)}
				</ChartCard>

				<ChartCard title={`Novas lojas — ${days} dias`}>
					{isLoading ? <Skeleton className='h-52 w-full rounded-xl' /> : (
						<ResponsiveContainer width='100%' height={210}>
							<BarChart data={stores} margin={{ top: 2, right: 4, bottom: 0, left: -20 }}>
								<CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
								<XAxis dataKey='date' tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={Math.ceil(stores.length / 8)} />
								<YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
								<Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
								<Bar dataKey='count' fill='#A78BFA' radius={[4, 4, 0, 0]} name='Lojas' />
							</BarChart>
						</ResponsiveContainer>
					)}
				</ChartCard>

				{/* Top stores */}
				<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
					<p className='border-b border-border/60 px-5 py-4 font-heading text-sm font-bold'>Top lojas</p>
					{isLoading ? (
						<div className='p-5 space-y-2'>{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className='h-10 rounded-xl' />)}</div>
					) : topStores.length === 0 ? (
						<div className='py-10 text-center text-sm text-muted-foreground'>Sem dados</div>
					) : (
						<table className='w-full text-sm'>
							<thead>
								<tr className='border-b border-border/40'>
									<th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground'>Loja</th>
									<th className='px-4 py-2 text-right text-xs font-medium text-muted-foreground'>Produtos</th>
									<th className='px-4 py-2 text-right text-xs font-medium text-muted-foreground'>Seguidores</th>
									<th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground'>Criada</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-border/40'>
								{topStores.map((s: Record<string, unknown>) => (
									<tr key={s.id as string} className='hover:bg-muted/30 transition-colors'>
										<td className='px-4 py-2.5 font-medium'>{s.name as string}</td>
										<td className='px-4 py-2.5 text-right tabular-nums'>{s.products as number}</td>
										<td className='px-4 py-2.5 text-right tabular-nums'>{s.followers as number}</td>
										<td className='px-4 py-2.5 text-xs text-muted-foreground'>{s.created_at ? format(new Date(s.created_at as string), 'd MMM yyyy', { locale: pt }) : '—'}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	)
}
