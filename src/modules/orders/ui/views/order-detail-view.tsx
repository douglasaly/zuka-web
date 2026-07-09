'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, PackageSearch } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { Button } from '@/components/ui/button'
import { fetchOrder, STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { formatPrice } from '@/utils/format-price'
import { OrderDetailSkeleton } from '../components/order-detail-skeleton'

interface OrderDetailViewProps {
	id: string
}

export const OrderDetailView = ({ id }: OrderDetailViewProps) => {
	const router = useRouter()

	const { data, isLoading } = useQuery({
		queryKey: ['order', id],
		queryFn: () => fetchOrder(id),
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
					render={<Link href='/feed/pedidos' />}
					variant='outline'
				>
					Voltar aos pedidos
				</Button>
			</div>
		)
	}

	const { order, items, storeSlug } = data

	return (
		<div className='mx-auto max-w-2xl px-4 py-6 md:py-8'>
			<Button
				variant='ghost'
				size='sm'
				type='button'
				onClick={() => router.back()}
				className='mb-4 -ml-2'
			>
				<ArrowLeft className='size-4' />
				Voltar
			</Button>

			<div className='overflow-hidden rounded-2xl border border-border/60 bg-card'>
				<div className='flex items-center gap-3 border-b border-border/60 p-4'>
					<div className='relative size-12 shrink-0 overflow-hidden rounded-full'>
						<Image
							src={order.storeAvatar ?? STORE_PLACEHOLDER}
							alt={order.storeName}
							fill
							placeholder='blur'
							blurDataURL={BLUR_PLACEHOLDER}
							className='object-cover'
						/>
					</div>
					<div className='min-w-0 flex-1'>
						<p className='font-semibold'>{order.storeName}</p>
						<p className='text-sm text-muted-foreground'>
							{order.date}
						</p>
					</div>
					<OrderStatusBadge
						status={order.status}
						label={order.statusLabel}
					/>
				</div>

				<div className='space-y-3 p-4'>
					{items.map((item) => (
						<div
							key={item.id}
							className='flex items-center justify-between text-sm'
						>
							<span>
								{item.productName} × {item.quantity}
							</span>
							<span className='font-medium'>
								{formatPrice(
									item.unitPrice * item.quantity,
									item.currency
								)}
							</span>
						</div>
					))}
				</div>

				<div className='flex items-center justify-between border-t border-border/60 p-4'>
					<span className='font-bold'>Total</span>
					<span className='text-lg font-bold'>
						{formatPrice(order.total, order.currency)}
					</span>
				</div>
			</div>

			{storeSlug && (
				<Button
					className='mt-4 w-full rounded-xl'
					render={<Link href={`/lojas/${storeSlug}`} />}
				>
					Ver loja
				</Button>
			)}
		</div>
	)
}
