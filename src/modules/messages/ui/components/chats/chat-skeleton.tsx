import { Skeleton } from '@/components/ui/skeleton'

const BUBBLE_WIDTHS = ['w-40', 'w-56', 'w-32', 'w-48', 'w-36', 'w-60']

export const ChatSkeleton = () => (
	<div className='flex flex-1 flex-col gap-3 px-4 pl-8 pb-32 pt-24'>
		{BUBBLE_WIDTHS.map((width, i) => (
			<div
				key={i}
				className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
			>
				<Skeleton className={`h-12 ${width} rounded-xl`} />
			</div>
		))}
	</div>
)
