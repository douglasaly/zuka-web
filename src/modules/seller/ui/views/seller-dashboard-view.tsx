'use client'

import { useState } from 'react'
import { useSellerDashboard } from '../../hooks/use-seller-dashboard'
import { SellerDashboardSkeleton } from '../components/seller-dashboard-skeleton'
import { QuickActions } from '../components/seller-quick-actions'
import { SellerStatsGrid } from '../components/seller-stats-grid'
import { SellerSummaryTab } from '../components/seller-summary-tab'
import { SellerTabs } from '../components/seller-tabs'
import { SellerWelcomeBanner } from '../components/seller-welcome-banner'
import { SellerOrdersSection } from '../sections/seller-orders-section'
import { SellerProductsSection } from '../sections/seller-product-section'

export const SellerDashboardView = () => {
	const [tab, setTab] = useState('Produtos')
	const { isLoading, storeName, storeSlug, stats, products, latestOrders } =
		useSellerDashboard()

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
					onEdit={(id) => {
						window.location.href = `/dashboard/seller/produtos/${id}/editar`
					}}
					onDelete={() => {}}
				/>
			)}

			{tab === 'Pedidos' && <SellerOrdersSection orders={latestOrders} />}
		</div>
	)
}
