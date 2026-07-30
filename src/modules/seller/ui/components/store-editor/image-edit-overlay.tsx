import { SquarePen } from 'lucide-react'
import { cn } from '@/lib/utils'

type ImageEditOverlayProps = {
	className?: string
	label?: string
}

/** Hover / focus / active edit affordance over an image preview. */
export function ImageEditOverlay({
	className,
	label = 'Editar imagem',
}: ImageEditOverlayProps) {
	return (
		<div
			className={cn(
				'pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-150 group-hover:bg-black/45 group-focus-visible:bg-black/45 group-active:bg-black/45',
				className
			)}
		>
			<span
				className='flex size-11 items-center justify-center rounded-full bg-white text-foreground opacity-0 shadow-md transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-active:opacity-100 scale-95'
				aria-hidden
			>
				<SquarePen className='size-4' strokeWidth={2.25} />
			</span>
			<span className='sr-only'>{label}</span>
		</div>
	)
}
