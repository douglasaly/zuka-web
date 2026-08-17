'use client'
import { cn } from '@/lib/utils'
import { formatTime } from '@/utils/format-time'

type SellerMessageBubbleProps = {
	content: string
	createdAt: string
	isStore: boolean
}
export function SellerMessageBubble({
	content,
	createdAt,
	isStore,
}: SellerMessageBubbleProps) {
	return (
		<div className={cn('flex', isStore ? 'justify-end' : 'justify-start')}>
			<div
				className={cn(
					'max-w-[min(85%,28rem)] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed wrap-break-word shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:max-w-[min(75%,28rem)] sm:text-sm',
					isStore
						? 'rounded-br-md bg-foreground text-background'
						: 'rounded-bl-md border border-border/60 bg-card'
				)}
			>
				<p className='whitespace-pre-wrap'>{content}</p>
				<p
					className={cn(
						'mt-1 text-right text-[10px] tabular-nums',
						isStore ? 'text-background/55' : 'text-muted-foreground'
					)}
				>
					{formatTime(createdAt)}
				</p>
			</div>
		</div>
	)
}
