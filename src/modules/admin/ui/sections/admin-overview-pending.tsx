'use client'
import { ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PendingStoreItem } from '@/modules/admin/ui/components/overview/pending-store-item'

type AdminOverviewPendingProps = {
	pendingLoading: boolean
	pendingApprovals: number | undefined
	pending: Record<string, unknown>[]
}
export function AdminOverviewPending({
	pendingLoading,
	pendingApprovals,
	pending,
}: AdminOverviewPendingProps) {
	return (
		<div className='rounded-2xl border border-border/60 bg-card'>
			<div className='flex items-center justify-between border-b border-border/60 px-5 py-4'>
				<div className='flex items-center gap-2'>
					<p className='font-heading text-sm font-bold'>
						Aprovações pendentes
					</p>
					{(pendingApprovals as number) > 0 && (
						<span className='flex size-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700'>
							{pendingApprovals}
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
					{pending.map((store) => (
						<PendingStoreItem
							key={store.id as string}
							store={store}
						/>
					))}
				</div>
			)}
		</div>
	)
}
