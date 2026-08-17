'use client'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SELLER_MESSAGES_SHELL } from '../../hooks/use-seller-messages'
export function SellerMessagesLoading() {
	return (
		<div className={SELLER_MESSAGES_SHELL}>
			<div className='flex min-h-0 w-full flex-col border-border/60 bg-card lg:w-80 lg:border-r xl:w-96'>
				<div className='flex h-14 items-center border-b border-border/60 px-4'>
					<div className='w-full space-y-1.5'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-3 w-32' />
					</div>
				</div>
				<div className='space-y-2 border-b border-border/60 p-3'>
					<Skeleton className='h-10 w-full rounded-full' />
				</div>
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-3 border-b border-border/50 px-4 py-3'
					>
						<Skeleton className='size-10 rounded-full' />
						<div className='flex-1 space-y-1.5'>
							<Skeleton className='h-4 w-32' />
							<Skeleton className='h-3 w-48' />
						</div>
					</div>
				))}
			</div>
			<div className='hidden min-w-0 flex-1 flex-col bg-muted/20 lg:flex'>
				<div className='flex h-14 items-center border-b border-border/60 bg-card/95 px-4'>
					<div className='space-y-1.5'>
						<Skeleton className='h-4 w-28' />
						<Skeleton className='h-3 w-36' />
					</div>
				</div>
				<div className='flex flex-1 items-center justify-center'>
					<Skeleton className='size-12 rounded-2xl' />
				</div>
			</div>
		</div>
	)
}
export function SellerMessagesError({ onRetry }: { onRetry: () => void }) {
	return (
		<div className='flex min-h-[50vh] min-w-0 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center'>
			<h2 className='font-heading text-lg font-bold tracking-tight'>
				Não foi possível carregar as mensagens
			</h2>
			<p className='mt-1.5 text-sm text-muted-foreground'>
				Tente novamente dentro de momentos.
			</p>
			<Button
				className='mt-6 rounded-full'
				variant='outline'
				onClick={onRetry}
			>
				Tentar novamente
			</Button>
		</div>
	)
}
export function SellerMessagesEmptyInbox() {
	return (
		<div className='flex min-h-[50vh] min-w-0 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-20 text-center'>
			<div className='flex size-14 items-center justify-center rounded-2xl bg-background shadow-sm ring-1 ring-border/60'>
				<Inbox className='size-7 text-muted-foreground' />
			</div>
			<h2 className='mt-5 font-heading text-xl font-bold tracking-tight'>
				Caixa de entrada vazia
			</h2>
			<p className='mt-1.5 max-w-sm text-sm text-muted-foreground'>
				Quando um cliente lhe enviar uma mensagem, aparecerá aqui.
			</p>
		</div>
	)
}
