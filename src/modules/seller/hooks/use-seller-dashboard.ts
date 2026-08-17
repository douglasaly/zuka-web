'use client'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useUserProfile } from '@/hooks/use-user-profile'
import type { UserProfile } from '@/types/marketplace'
import { formatPrice } from '@/utils/format-price'
import type { SellerProduct } from '../constants'
import type { SellerStatData } from '../ui/components/seller-stat-card'

type StatsData = {
	totalSales: number
	totalSalesPct: number
	totalOrders: number
	totalOrdersPct: number
	whatsappContacts: number
	whatsappContactsPct: number
	callContacts: number
	callContactsPct: number
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
export type DashboardOrder = {
	id: string
	storeName: string
	date: string
	itemCount: number
	total: number
	currency: string
	status: 'shipping' | 'pending' | 'completed' | 'cancelled'
	statusLabel: string
}
export function useSellerDashboard() {
	const { profile: sessionProfile } = useUserProfile()
	const userKey = sessionProfile?.id ?? 'anon'
	const { data: profile, isLoading: isLoadingProfile } = useQuery<{
		profile: UserProfile
	}>({
		queryKey: ['profile', userKey],
		queryFn: () => fetch('/api/me/profile').then((r) => r.json()),
		staleTime: 5 * 60 * 1000,
	})
	const { data: statsResponse, isLoading: isLoadingStats } = useQuery<{
		data: StatsData
	}>({
		queryKey: ['seller-stats', userKey],
		queryFn: () => fetch('/api/seller/stats').then((r) => r.json()),
		staleTime: 60_000,
	})
	const { data: productsData, isLoading: isLoadingProducts } = useQuery<{
		products: ApiProduct[]
	}>({
		queryKey: ['seller-dashboard-products', userKey],
		queryFn: () =>
			fetch('/api/seller/products?limit=20').then((r) => r.json()),
	})
	const { data: ordersData, isLoading: isLoadingOrders } = useQuery<{
		orders: DashboardOrder[]
	}>({
		queryKey: ['seller-dashboard-orders', userKey],
		queryFn: () =>
			fetch('/api/seller/orders?limit=5').then((r) => r.json()),
	})
	const isLoading =
		isLoadingProfile ||
		isLoadingStats ||
		isLoadingProducts ||
		isLoadingOrders
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
					id: 'products',
					icon: 'eye',
					value: statsData.productCount.toString(),
					label: 'Produtos activos',
				},
				{
					id: 'orders',
					icon: 'package',
					value: statsData.totalOrders.toString(),
					label: 'Pedidos',
					change: statsData.totalOrdersPct,
				},
				{
					id: 'whatsapp',
					icon: 'whatsapp',
					value: statsData.whatsappContacts.toLocaleString('pt-MZ'),
					label: 'WhatsApp',
					change: statsData.whatsappContactsPct,
				},
				{
					id: 'calls',
					icon: 'phone',
					value: statsData.callContacts.toLocaleString('pt-MZ'),
					label: 'Chamadas',
					change: statsData.callContactsPct,
				},
				{
					id: 'followers',
					icon: 'users',
					value: statsData.totalFollowers.toLocaleString('pt-MZ'),
					label: 'Seguidores',
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
	return {
		isLoading,
		storeName,
		storeSlug,
		stats,
		products,
		latestOrders,
	}
}
