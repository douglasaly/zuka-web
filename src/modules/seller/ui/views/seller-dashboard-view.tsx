'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { UserProfile } from '@/types/marketplace'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatPrice } from '@/utils/format-price'
import { Package } from 'lucide-react'
import { SellerEmptyState } from '../components/seller-empty-state'
import { QuickActions } from '../components/seller-quick-actions'
import { SellerStatsGrid } from '../components/seller-stats-grid'
import type { SellerStatData } from '../components/seller-stat-card'
import { SellerSummaryTab } from '../components/seller-summary-tab'
import {
	SellerDashboardSkeleton,
} from '../components/seller-dashboard-skeleton'
import { SellerTabs } from '../components/seller-tabs'
import { SellerWelcomeBanner } from '../components/seller-welcome-banner'
import { SellerProductsSection } from '../sections/seller-product-section'
import type { SellerProduct } from '../../constants'

type StatsData = {
	totalSales: number
	totalSalesPct: number
	totalOrders: number
	totalOrdersPct: number
	totalFollowers: number
	productCount: number
}

type ApiProduct = {
	id: string
	name: string
	price: number
	currency: string
	image: string | null
}

type DashboardOrder = {
	id: string
	storeName: string
	date: string
	itemCount: number
	total: number
	currency: string
	status: 'shipping' | 'pending' | 'completed' | 'cancelled'
	statusLabel: string
}

export const SellerDashboardView = () => {
	const [tab, setTab] = useState('Produtos')

	const { data: profile, isLoading: isLoadingProfile } = useQuery<{
		profile: UserProfile
	}>({
		queryKey: ['profile'],
		queryFn: () => fetch('/api/me/profile').then((r) => r.json()),
		staleTime: 5 * 60 * 1000,
	})

	const { data: statsResponse, isLoading: isLoadingStats } = useQuery<{
		data: StatsData
	}>({
		queryKey: ['seller-stats'],
		queryFn: () => fetch('/api/seller/stats').then((r) => r.json()),
	})

	const { data: productsData, isLoading: isLoadingProducts } = useQuery<{
		products: ApiProduct[]
	}>({
		queryKey: ['seller-dashboard-products'],
		queryFn: () =>
			fetch('/api/seller/products?limit=20').then((r) => r.json()),
	})

	const { data: ordersData, isLoading: isLoadingOrders } = useQuery<{
		orders: DashboardOrder[]
	}>({
		queryKey: ['seller-dashboard-orders'],
		queryFn: () =>
			fetch('/api/seller/orders?limit=5').then((r) => r.json()),
	})

	const isLoading =
		isLoadingProfile || isLoadingStats || isLoadingProducts || isLoadingOrders
	const storeName = profile?.profile?.stores?.[0]?.name ?? 'Sua Loja'
	const storeSlug = profile?.profile?.stores?.[0]?.slug
	const statsData = statsResponse?.data

	const stats: SellerStatData[] = statsData
		? [
				{
					id: 'sales',
					icon: 'trending',
					value: `MZN ${statsData.totalSales.toLocaleString('pt-MZ')}`,
					label: 'Vendas',
					change: statsData.totalSalesPct,
				},
				{
					id: 'orders',
					icon: 'package',
					value: statsData.totalOrders.toString(),
					label: 'Pedidos',
					change: statsData.totalOrdersPct,
				},
				{
					id: 'followers',
					icon: 'users',
					value: statsData.totalFollowers.toLocaleString('pt-MZ'),
					label: 'Seguidores',
				},
				{
					id: 'products',
					icon: 'eye',
					value: statsData.productCount.toString(),
					label: 'Produtos activos',
				},
			]
		: []

	const products: SellerProduct[] = useMemo(
		() =>
			(productsData?.products ?? []).map((p) => ({
				id: p.id,
				name: p.name,
				price: formatPrice(p.price, p.currency),
				imageUrl: p.image ?? '/placeholder.png',
			})),
		[productsData]
	)

	const latestOrders = ordersData?.orders ?? []

	if (isLoading) {
		return <SellerDashboardSkeleton />
	}

	return (
		<div className='space-y-6'>
			<SellerWelcomeBanner storeName={storeName} />

			{stats.length > 0 && <SellerStatsGrid stats={stats} />}

			<QuickActions storeSlug={storeSlug} />

			<SellerTabs value={tab} onChange={setTab} />

			{tab === 'Resumo' && <SellerSummaryTab />}

			{tab === 'Produtos' && (
				<SellerProductsSection
					products={products}
					onAdd={() => {}}
					onEdit={(id) =>
						(window.location.href = `/dashboard/seller/produtos/${id}/editar`)
					}
					onDelete={() => {}}
				/>
			)}

			{tab === 'Pedidos' && (
				<div className='space-y-4'>
					{latestOrders.length === 0 ? (
						<SellerEmptyState
							icon={Package}
							title='Nenhum pedido ainda'
							description='Quando receber pedidos, eles aparecerão aqui.'
							cta={{
								label: 'Ver produtos',
								href: '/dashboard/seller/produtos',
							}}
						/>
					) : (
						<>
							<div className='space-y-2'>
								{latestOrders.map((order) => (
									<div
										key={order.id}
										className='flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4'
									>
										<div className='flex flex-1 flex-col gap-1'>
											<div className='flex items-center gap-2'>
												<span className='font-medium'>
													#{order.id.slice(0, 8)}
												</span>
												<OrderStatusBadge
													status={order.status}
													label={order.statusLabel}
												/>
											</div>
											<p className='text-sm text-muted-foreground'>
												{new Date(order.date).toLocaleDateString('pt-PT')}{' '}
												&middot; {order.itemCount}{' '}
												{order.itemCount === 1 ? 'item' : 'itens'}
											</p>
										</div>
										<p className='font-semibold'>
											{formatPrice(order.total, order.currency)}
										</p>
									</div>
								))}
							</div>
							<Link
								href='/dashboard/seller/pedidos'
								className='block text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
							>
								Ver todos os pedidos
							</Link>
						</>
					)}
				</div>
			)}
		</div>
	)
}
