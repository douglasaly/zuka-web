'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, PackageSearch } from 'lucide-react'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { Button } from '@/components/ui/button'
import { OrderDetailSkeleton } from '@/modules/orders/ui/components/order-detail-skeleton'
import { formatPrice } from '@/utils/format-price'

interface SellerOrderDetailViewProps {
	id: string
}

type OrderDetail = {
	id: string
	storeName: string
	storeAvatar: string | null
	date: string
	itemCount: number
	total: number
	currency: string
	status: 'shipping' | 'pending' | 'completed' | 'cancelled'
	statusLabel: string
}

export const SellerOrderDetailView = ({ id }: SellerOrderDetailViewProps) => {
	const { data, isLoading } = useQuery<OrderDetail>({
		queryKey: ['seller-order', id],
		queryFn: async () => {
			const res = await fetch(`/api/seller/orders/${id}`)
			if (!res.ok) throw new Error('Failed to load order')
			const json = await res.json()
			return json.order ?? json
		},
	})

	if (isLoading) {
		return <OrderDetailSkeleton />
	}

	if (!data) {
		return (
			<div className='mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4'>
				<div className='flex size-14 items-center justify-center rounded-full bg-muted'>
					<PackageSearch className='size-7 text-muted-foreground' />
				</div>
				<div className='text-center'>
					<p className='text-lg font-medium'>Pedido não encontrado</p>
					<p className='mt-1 text-sm text-muted-foreground'>
						O pedido que procura não existe ou foi removido.
					</p>
				</div>
				<Button
					variant='outline'
					className='rounded-full'
					render={
						<Link href='/dashboard/seller/pedidos'>
							<ArrowLeft className='mr-1 size-4' />
							Voltar aos pedidos
						</Link>
					}
				/>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-3'>
				<Button
					variant='ghost'
					size='icon'
					className='shrink-0'
					render={
						<Link href='/dashboard/seller/pedidos'>
							<ArrowLeft className='size-4' />
						</Link>
					}
				/>
				<div>
					<p className='text-sm text-muted-foreground'>
						Pedido #{data.id.slice(0, 8)}
					</p>
					<h1 className='font-heading text-xl font-bold'>
						Detalhes do pedido
					</h1>
				</div>
				<OrderStatusBadge
					label={data.statusLabel}
					status={data.status}
				/>
			</div>

			<div className='grid gap-4 md:grid-cols-2'>
				<div className='rounded-xl border border-border/60 bg-card p-5'>
					<p className='mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
						Informação
					</p>
					<div className='space-y-2 text-sm'>
						<div className='flex justify-between'>
							<span className='text-muted-foreground'>Data</span>
							<span>
								{new Date(data.date).toLocaleDateString(
									'pt-PT'
								)}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='text-muted-foreground'>Itens</span>
							<span>{data.itemCount}</span>
						</div>
						<div className='flex justify-between'>
							<span className='text-muted-foreground'>Total</span>
							<span className='font-semibold'>
								{formatPrice(data.total, data.currency)}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='text-muted-foreground'>Loja</span>
							<span>{data.storeName}</span>
						</div>
					</div>
				</div>

				<div className='rounded-xl border border-border/60 bg-card p-5'>
					<p className='mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
						Acções
					</p>
					<div className='flex flex-wrap gap-2'>
						<Button
							size='sm'
							variant='default'
							className='rounded-full'
						>
							Confirmar pedido
						</Button>
						<Button
							size='sm'
							variant='outline'
							className='rounded-full'
						>
							Contactar cliente
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
