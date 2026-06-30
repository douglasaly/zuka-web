'use client'

import { useState } from 'react'
import { MOCK_SELLER_PRODUCTS, MOCK_SELLER_STATS } from '../../constants'
import { SellerStatsGrid } from '../components/seller-stats-grid'
import { SellerTabs } from '../components/seller-tabs'
import { SellerWelcomeBanner } from '../components/seller-welcome-banner'
import { SellerProductsSection } from '../sections/seller-product-section'

export const SellerDashboardView = () => {
	const [tab, setTab] = useState('Produtos')
	const [products, setProducts] = useState(MOCK_SELLER_PRODUCTS)

	const handleAddProduct = () => {
		// TODO: navegar para /dashboard/seller/produtos/novo
	}

	const handleEditProduct = (id: string) => {
		// TODO: navegar para /dashboard/seller/produtos/[id]/editar
	}

	const handleDeleteProduct = (id: string) => {
		setProducts((prev) => prev.filter((p) => p.id !== id))
		// TODO: chamar API para eliminar produto
	}

	return (
		<div className='flex min-h-screen bg-neutral-50'>
			<main className='flex-1 space-y-6 p-8'>
				<SellerWelcomeBanner storeName='Auto Style MZ' />

				<SellerStatsGrid stats={MOCK_SELLER_STATS} />

				<SellerTabs value={tab} onChange={setTab} />

				{tab === 'Resumo' && (
					<div className='rounded-2xl border bg-white p-8 text-center text-muted-foreground'>
						Resumo em breve
					</div>
				)}

				{tab === 'Produtos' && (
					<SellerProductsSection
						products={products}
						onAdd={handleAddProduct}
						onEdit={handleEditProduct}
						onDelete={handleDeleteProduct}
					/>
				)}

				{tab === 'Pedidos' && (
					<div className='rounded-2xl border bg-white p-8 text-center text-muted-foreground'>
						Pedidos em breve
					</div>
				)}
			</main>
		</div>
	)
}
