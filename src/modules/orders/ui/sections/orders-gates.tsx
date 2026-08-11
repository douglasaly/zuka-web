import { PackageOpen, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/modules/profile/ui/components/empty-state'
import { OrderSkeleton } from '../components/order-skeleton'

export function OrdersLoading() {
	return (
		<div aria-busy='true' aria-label='A carregar pedidos'>
			<OrderSkeleton />
		</div>
	)
}

export function OrdersError({
	isFetching,
	onRetry,
}: {
	isFetching: boolean
	onRetry: () => void
}) {
	return (
		<div className='flex flex-col items-center gap-4 rounded-2xl border border-border/70 bg-card py-12 text-center'>
			<div className='flex size-12 items-center justify-center rounded-full bg-muted'>
				<RefreshCw className='size-6 text-muted-foreground' />
			</div>
			<div>
				<p className='text-sm font-medium'>
					Não foi possível carregar os pedidos
				</p>
				<p className='mt-1 text-xs text-muted-foreground'>
					Verifica a ligação e tenta outra vez.
				</p>
			</div>
			<Button
				variant='outline'
				className='min-h-11 rounded-full'
				disabled={isFetching}
				onClick={onRetry}
			>
				{isFetching ? 'A tentar…' : 'Tentar novamente'}
			</Button>
		</div>
	)
}

export function OrdersEmptyAll() {
	return (
		<EmptyState
			icon={PackageOpen}
			title='Ainda não fizeste nenhum pedido'
			description='Explora produtos e contacta lojas para começar. Os teus pedidos aparecem aqui.'
			className='py-16'
			action={
				<Button
					className='min-h-11 rounded-full px-5'
					render={<Link href='/feed/explorar' />}
				>
					Explorar produtos
				</Button>
			}
		/>
	)
}

export function OrdersEmptyFiltered({
	hasFilters,
	onClear,
}: {
	hasFilters: boolean
	onClear: () => void
}) {
	return (
		<EmptyState
			icon={PackageOpen}
			title='Nenhum pedido encontrado'
			description='Ajusta a pesquisa ou os filtros para ver outros resultados.'
			className='py-14'
			action={
				hasFilters ? (
					<Button
						variant='outline'
						className='min-h-11 rounded-full'
						onClick={onClear}
					>
						Limpar filtros
					</Button>
				) : null
			}
		/>
	)
}
