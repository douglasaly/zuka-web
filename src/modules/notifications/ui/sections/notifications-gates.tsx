import { Bell, BellOff, Lock, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/modules/profile/ui/components/empty-state'
import { NotificationsPageSkeleton } from '../components/notification-page-skeleton'
export function NotificationsLoading() {
	return (
		<output
			aria-busy='true'
			aria-label='A carregar notificações'
			className='block'
		>
			<NotificationsPageSkeleton />
		</output>
	)
}
export function NotificationsError({
	isFetching,
	onRetry,
}: {
	isFetching: boolean
	onRetry: () => void
}) {
	return (
		<div className='flex flex-col items-center gap-4 rounded-2xl border border-border/70 bg-card py-12 text-center'>
			<div className='flex size-12 items-center justify-center rounded-full bg-muted'>
				<RefreshCw
					className='size-6 text-muted-foreground'
					aria-hidden
				/>
			</div>
			<div>
				<p className='text-sm font-medium'>
					Não foi possível carregar as notificações
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
export function NotificationsSignedOut() {
	return (
		<EmptyState
			icon={Lock}
			title='Inicia sessão para ver as notificações'
			description='Avisamos-te aqui quando uma loja responder, confirmar um pedido ou receberes uma avaliação.'
			className='py-16'
			action={
				<Button
					className='min-h-11 rounded-full px-5'
					render={<Link href='/auth/login?next=/notificacoes' />}
				>
					Entrar
				</Button>
			}
		/>
	)
}
export function NotificationsEmptyAll() {
	return (
		<EmptyState
			icon={Bell}
			title='Tudo em dia'
			description='Ainda não tens notificações. Quando uma loja responder ou um pedido mudar de estado, aparece aqui.'
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
export function NotificationsEmptyFiltered({
	onClear,
}: {
	onClear: () => void
}) {
	return (
		<EmptyState
			icon={BellOff}
			title='Nada neste filtro'
			description='Não há notificações que correspondam ao filtro escolhido.'
			className='py-14'
			action={
				<Button
					variant='outline'
					className='min-h-11 rounded-full'
					onClick={onClear}
				>
					Ver todas
				</Button>
			}
		/>
	)
}
