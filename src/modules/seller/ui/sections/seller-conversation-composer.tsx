'use client'

import { Loader2, Send } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Textarea } from '@/components/ui/textarea'

type SellerConversationComposerProps = {
	input: string
	onInputChange: (value: string) => void
	onSend: () => void
	isPending: boolean
}

export function SellerConversationComposer({
	input,
	onInputChange,
	onSend,
	isPending,
}: SellerConversationComposerProps) {
	return (
		<div className='shrink-0 border-t border-border/60 bg-card/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:px-4 sm:pt-4 sm:pb-4'>
			<form
				className='mx-auto flex max-w-3xl items-end gap-2'
				onSubmit={(e) => {
					e.preventDefault()
					onSend()
				}}
			>
				<Textarea
					value={input}
					onChange={(e) => onInputChange(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault()
							onSend()
						}
					}}
					placeholder='Escreva uma mensagem…'
					rows={1}
					className='max-h-32 min-h-11 flex-1 resize-none rounded-2xl py-2.5 text-base sm:text-sm'
					disabled={isPending}
					aria-label='Mensagem'
					enterKeyHint='send'
				/>
				<IconTooltipButton
					label={isPending ? 'A enviar…' : 'Enviar mensagem'}
					type='submit'
					size='icon'
					variant='default'
					className='size-11 shrink-0'
					disabled={!input.trim() || isPending}
				>
					{isPending ? (
						<Loader2 className='size-4 animate-spin' />
					) : (
						<Send className='size-4' />
					)}
				</IconTooltipButton>
			</form>
			<p className='mx-auto mt-1.5 hidden max-w-3xl text-[11px] text-muted-foreground sm:block'>
				Enter para enviar · Shift+Enter para nova linha
			</p>
		</div>
	)
}
