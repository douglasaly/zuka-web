'use client'

import { Store } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { BuyerOrder } from '@/modules/orders/types'

type OrderDetailStoreProps = {
	order: BuyerOrder
}

export function OrderDetailStore({ order }: OrderDetailStoreProps) {
	return (
		<section className='space-y-3' aria-labelledby='order-store'>
			<h2
				id='order-store'
				className='font-heading text-sm font-semibold tracking-tight'
			>
				Loja
			</h2>
			<div className='flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4'>
				<div className='relative size-12 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border/60'>
					<Image
						src={order.storeAvatar ?? STORE_PLACEHOLDER}
						alt=''
						fill
						placeholder='blur'
						blurDataURL={BLUR_PLACEHOLDER}
						sizes='48px'
						className='object-cover'
					/>
				</div>
				<div className='min-w-0 flex-1'>
					<p className='truncate font-semibold'>{order.storeName}</p>
					<p className='text-xs text-muted-foreground'>
						Contacto directo com o vendedor
					</p>
				</div>
				{order.storeSlug ? (
					<Button
						variant='outline'
						size='sm'
						className='min-h-10 shrink-0 rounded-full'
						render={<Link href={`/lojas/${order.storeSlug}`} />}
					>
						<Store className='size-3.5' aria-hidden />
						Ver loja
					</Button>
				) : null}
			</div>
		</section>
	)
}
