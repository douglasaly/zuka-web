'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cartItemCount } from '@/modules/cart/lib/cart-utils'
import type { Cart } from '@/modules/cart/types'

type CartStoreFilterProps = {
	carts: Cart[]
	value: string
	onChange: (storeId: string) => void
}

export function CartStoreFilter({
	carts,
	value,
	onChange,
}: CartStoreFilterProps) {
	if (carts.length < 2) return null

	return (
		<div className='-mx-4 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0'>
			<Tabs
				value={value}
				onValueChange={(next) => {
					if (typeof next === 'string') onChange(next)
				}}
				className='w-max min-w-full'
			>
				<TabsList
					variant='default'
					className='h-10 w-max min-w-full justify-start gap-0.5 rounded-xl p-1'
				>
					<TabsTrigger
						value='all'
						className='h-8 min-h-8 flex-none shrink-0 rounded-lg px-3 text-sm'
					>
						Todas
						<span className='ml-1 tabular-nums opacity-70'>
							{carts.length}
						</span>
					</TabsTrigger>
					{carts.map((cart) => (
						<TabsTrigger
							key={cart.storeId}
							value={cart.storeId}
							className='h-8 min-h-8 flex-none shrink-0 rounded-lg px-3 text-sm'
						>
							{cart.storeName}
							<span className='ml-1 tabular-nums opacity-70'>
								{cartItemCount(cart)}
							</span>
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
		</div>
	)
}
