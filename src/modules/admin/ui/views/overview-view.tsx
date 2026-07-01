'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts'
import Link from 'next/link'
import {
	ArrowRight,
	Clock,
	Package,
	Store,
	Users,
	MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { KpiCard } from '../components/kpi-card'
import { StatusBadge } from '../components/status-badge'

async function fetchStats() {
	const res = await fetch('/api/admin/stats', { credentials: 'include' })
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function fetchAnalytics() {
	const res = await fetch('/api/admin/analytics?days=30', {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function fetchPendingStores() {
	const res = await fetch('/api/admin/stores?status=PENDING&limit=5', {
		credentials: 'include',
	})
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

export function AdminOverviewView() {
	const { data: stats, isLoading: statsLoading } = useQuery({
		queryKey: ['admin-stats'],
		queryFn: fetchStats,
	})
	const { data: analytics, isLoading: analyticsLoading } = useQuery({
		queryKey: ['admin-analytics-30'],
		queryFn: fetchAnalytics,
	})
	const { data: pendingData, isLoading: pendingLoading } = useQuery({
		queryKey: ['admin-pending-stores'],
		queryFn: fetchPendingStores,
	})

	const pending = pendingData?.stores ?? []
	const signups = (analytics?.signupsByDay ?? []).map(
		(d: { date: string; count: number }) => ({
			...d,
			date: formatDay(d.date),
		})
	)
	const products = (analytics?.productsByDay ?? []).map(
		(d: { date: string; count: number }) => ({
			...d,
			date: formatDay(d.date),
		})
	)

	return (
		<div className='space-y-8'>
			{/* KPI row */}
			<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
				{statsLoading ? (
					Array.from({ length: 5 }, (_, i) => (
						<Skeleton key={i} className='h-28 rounded-2xl' />
					))
				) : (
					<>
						<KpiCard
							label='Total utilizadores'
							value={stats?.totalUsers ?? 0}
							pct={stats?.totalUsersPct}
						/>
						<KpiCard
							label='Lojas ativas'
							value={stats?.activeStores ?? 0}
							pct={stats?.activeStoresPct}
						/>
						<KpiCard
							label='Aprovações pendentes'
							value={stats?.pendingApprovals ?? 0}
						/>
						<KpiCard
							label='Produtos listados'
							value={stats?.totalProducts ?? 0}
							pct={stats?.totalProductsPct}
						/>
						<KpiCard
							label='Mensagens hoje'
							value={stats?.messagesToday ?? 0}
						/>
					</>
				)}
			</div>

			{/* Charts */}
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

			{/* Pending approvals widget */}
			<div className='rounded-2xl border border-border/60 bg-card'>
				<div className='flex items-center justify-between border-b border-border/60 px-5 py-4'>
					<div className='flex items-center gap-2'>
						<p className='font-heading text-sm font-bold'>
							Aprovações pendentes
						</p>
						{stats?.pendingApprovals > 0 && (
							<span className='flex size-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700'>
								{stats.pendingApprovals}
							</span>
						)}
					</div>
					<Button
						render={
							<Link href='/admin/stores/pending'>
								Ver todas <ArrowRight className='size-3.5' />
							</Link>
						}
						variant='ghost'
						size='sm'
					/>
				</div>

				{pendingLoading ? (
					<div className='p-5 space-y-3'>
						{Array.from({ length: 3 }, (_, i) => (
							<Skeleton key={i} className='h-12 rounded-xl' />
						))}
					</div>
				) : pending.length === 0 ? (
					<div className='flex flex-col items-center justify-center gap-2 py-12 text-center'>
						<Clock className='size-8 text-muted-foreground/30' />
						<p className='text-sm text-muted-foreground'>
							Nenhuma loja aguarda aprovação
						</p>
					</div>
				) : (
					<div className='divide-y divide-border/40'>
						{pending.map((store: Record<string, unknown>) => (
							<div
								key={store.id as string}
								className='flex items-center justify-between px-5 py-3'
							>
								<div className='min-w-0'>
									<p className='truncate text-sm font-semibold'>
										{store.name as string}
									</p>
									<p className='truncate text-xs text-muted-foreground'>
										{((
											store.users as Record<
												string,
												unknown
											>
										)?.email as string) ?? '—'}
									</p>
								</div>
								<Button
									render={
										<Link
											href={`/admin/stores/pending?review=${store.id as string}`}
										>
											Rever
										</Link>
									}
									size='sm'
									variant='outline'
								/>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
