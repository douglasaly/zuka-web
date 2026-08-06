import { ArrowLeft } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'

type MessagesHeaderProps = {
	count?: number
}

/** Matches HomeSidebar header height (h-20 / py-3.5 + text-3xl + xs). */
export const MessagesHeader = ({ count }: MessagesHeaderProps) => (
	<header className='fixed left-0 right-0 top-0 z-50 flex h-20 items-center border-b border-border/60 bg-background/95 px-4 backdrop-blur-sm md:left-64'>
		<div className='flex w-full items-center gap-2.5 md:pr-8'>
			<IconTooltipButton label='Voltar' href='/' className='size-9 shrink-0'>
				<ArrowLeft className='size-5' />
			</IconTooltipButton>
			<div className='flex min-w-0 flex-1 flex-col justify-center'>
				<div className='flex min-w-0 items-center gap-2'>
					<h1 className='truncate font-heading text-3xl font-extrabold tracking-tight'>
						Mensagens
					</h1>
					{typeof count === 'number' && count > 0 ? (
						<span
							className='inline-flex min-h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-secondary px-1.5 text-[10px] font-bold text-secondary-foreground'
							aria-label={`${count} ${count === 1 ? 'mensagem' : 'mensagens'} por ler`}
						>
							{count > 99 ? '99+' : count}
						</span>
					) : null}
				</div>
				<span className='truncate text-xs text-muted-foreground'>
					{typeof count === 'number' && count > 0
						? `${count} por ler`
						: 'As tuas conversas com lojas'}
				</span>
			</div>
		</div>
	</header>
)
