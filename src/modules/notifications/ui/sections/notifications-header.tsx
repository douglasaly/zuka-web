'use client'
import { ArrowLeft, CheckCheck, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type NotificationsHeaderProps = {
	unreadCount: number
	isReady: boolean
	isMarkingAll: boolean
	onMarkAllRead: () => void
	isFetching: boolean
	onRefresh: () => void
}
const COMPACT_ACTION = 'min-h-9 gap-1.5 rounded-full max-sm:size-9 max-sm:p-0'
export function NotificationsHeader({
	unreadCount,
	isReady,
	isMarkingAll,
	onMarkAllRead,
	isFetching,
	onRefresh,
}: NotificationsHeaderProps) {
	const router = useRouter()
	const goBack = () => {
		if (window.history.length > 1) router.back()
		else router.push('/')
	}
	const summary =
		unreadCount > 0
			? `${unreadCount} não ${unreadCount === 1 ? 'lida' : 'lidas'}`
			: 'Tudo em dia, nada por ler.'
	return (
		<header className='flex items-start gap-2'>
			<IconTooltipButton
				label='Voltar'
				className='-ml-1 mt-0.5'
				onClick={goBack}
			>
				<ArrowLeft className='size-4' />
			</IconTooltipButton>

			<div className='min-w-0 flex-1'>
				<h1 className='font-heading text-2xl font-bold tracking-tight md:text-3xl'>
					Notificações
				</h1>
				<p
					className='mt-1 min-h-5 text-sm text-muted-foreground'
					aria-live='polite'
				>
					{isReady ? summary : null}
				</p>
			</div>

			{isReady ? (
				<div className='flex shrink-0 items-center gap-2'>
					{unreadCount > 0 ? (
						<Button
							variant='outline'
							size='sm'
							className={COMPACT_ACTION}
							aria-label='Marcar todas como lidas'
							disabled={isMarkingAll}
							onClick={onMarkAllRead}
						>
							<CheckCheck className='size-4' aria-hidden />
							<span className='hidden sm:inline'>
								Marcar todas como lidas
							</span>
						</Button>
					) : null}

					<Button
						variant='ghost'
						size='sm'
						className={cn(
							COMPACT_ACTION,
							'max-sm:hidden text-muted-foreground'
						)}
						aria-label='Actualizar notificações'
						disabled={isFetching}
						onClick={onRefresh}
					>
						<RefreshCw
							className={cn(
								'size-4',
								isFetching && 'animate-spin'
							)}
							aria-hidden
						/>
						<span className='hidden sm:inline'>
							{isFetching ? 'A actualizar…' : 'Actualizar'}
						</span>
					</Button>
				</div>
			) : null}
		</header>
	)
}
