'use client'
import { ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { NotificationType } from '@/types'
import {
	NOTIFICATION_META,
	NOTIFICATION_TYPE_ORDER,
	type NotificationFilter,
} from '../../constants'

type NotificationsAsideProps = {
	filter: NotificationFilter
	unreadCounts: Partial<Record<NotificationFilter, number>>
	onFilterChange: (filter: NotificationFilter) => void
	className?: string
}
export function NotificationsAside({
	filter,
	unreadCounts,
	onFilterChange,
	className,
}: NotificationsAsideProps) {
	const pending = NOTIFICATION_TYPE_ORDER.map((type) => ({
		type,
		count: unreadCounts[type] ?? 0,
	})).filter((entry) => entry.count > 0)
	return (
		<aside
			className={cn(
				'hidden w-80 shrink-0 flex-col gap-4 xl:sticky xl:top-42 xl:flex 2xl:w-96',
				className
			)}
			aria-label='Resumo das notificações'
		>
			{pending.length > 0 ? (
				<section className='rounded-2xl border border-border/70 bg-card p-5'>
					<h2 className='font-heading text-sm font-semibold tracking-tight'>
						Por ler
					</h2>
					<p className='mt-1 text-sm text-muted-foreground'>
						Salta directo para o que ainda não viste.
					</p>

					<div className='mt-4 space-y-2'>
						{pending.map(({ type, count }) => (
							<PendingRow
								key={type}
								type={type}
								count={count}
								isActive={filter === type}
								onClick={() => onFilterChange(type)}
							/>
						))}
					</div>
				</section>
			) : null}

			<section className='rounded-2xl border border-border/70 bg-card p-5'>
				<h2 className='font-heading text-sm font-semibold tracking-tight'>
					Atalhos
				</h2>
				<p className='mt-1 text-sm text-muted-foreground'>
					As notificações levam-te sempre a um destes lugares.
				</p>

				<div className='mt-4 flex flex-col gap-2'>
					<Button
						variant='outline'
						className='min-h-11 w-full justify-start rounded-xl'
						render={<Link href='/feed/pedidos' />}
					>
						<ShoppingBag className='size-4' aria-hidden />
						Meus pedidos
						<ArrowRight
							className='ml-auto size-4 text-muted-foreground'
							aria-hidden
						/>
					</Button>
					<Button
						variant='outline'
						className='min-h-11 w-full justify-start rounded-xl'
						render={<Link href='/mensagens' />}
					>
						<MessageCircle className='size-4' aria-hidden />
						Mensagens
						<ArrowRight
							className='ml-auto size-4 text-muted-foreground'
							aria-hidden
						/>
					</Button>
				</div>
			</section>
		</aside>
	)
}
function PendingRow({
	type,
	count,
	isActive,
	onClick,
}: {
	type: NotificationType
	count: number
	isActive: boolean
	onClick: () => void
}) {
	const meta = NOTIFICATION_META[type]
	const Icon = meta.icon
	return (
		<button
			type='button'
			aria-pressed={isActive}
			onClick={onClick}
			className={cn(
				'flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
				isActive && 'bg-muted'
			)}
		>
			<span
				className={cn(
					'flex size-9 shrink-0 items-center justify-center rounded-full',
					meta.tint
				)}
			>
				<Icon className='size-4' aria-hidden />
			</span>
			<span className='min-w-0 flex-1'>
				<span className='block text-sm font-medium text-foreground'>
					{meta.plural}
				</span>
				<span className='block text-xs text-muted-foreground'>
					{count === 1 ? '1 por ler' : `${count} por ler`}
				</span>
			</span>
			<ArrowRight
				className='size-4 shrink-0 text-muted-foreground'
				aria-hidden
			/>
		</button>
	)
}
