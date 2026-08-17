import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
export const OrderSkeleton = () => (
	<div
		className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'
		aria-hidden
	>
		<div className='order-2 min-w-0 flex-1 space-y-3 lg:order-1'>
			<Skeleton className='h-4 w-24 rounded-md' />
			<ul className='grid gap-3'>
				{Array.from({ length: 3 }).map((_, i) => (
					<li key={i}>
						<Card size='sm' className='gap-0 py-0'>
							<CardContent className='flex gap-3 py-4'>
								<Skeleton className='size-16 shrink-0 rounded-xl sm:size-20' />
								<div className='min-w-0 flex-1 space-y-2'>
									<div className='flex justify-between gap-2'>
										<Skeleton className='h-4 w-40 rounded-md' />
										<Skeleton className='h-6 w-24 rounded-full' />
									</div>
									<Skeleton className='h-3.5 w-28 rounded-md' />
									<Skeleton className='h-3.5 w-36 rounded-md' />
									<Skeleton className='h-5 w-20 rounded-md' />
								</div>
							</CardContent>
							<CardFooter className='justify-between border-t border-border/60 py-3'>
								<Skeleton className='h-9 w-24 rounded-full' />
								<Skeleton className='h-9 w-32 rounded-full' />
							</CardFooter>
						</Card>
					</li>
				))}
			</ul>
		</div>

		<aside className='order-1 flex w-full shrink-0 flex-col gap-4 lg:sticky lg:top-24 lg:order-2 lg:w-[min(100%,22rem)] xl:w-96'>
			<div className='space-y-3 rounded-2xl border border-border/70 bg-card p-5'>
				<Skeleton className='h-5 w-44 rounded-md' />
				<Skeleton className='h-4 w-full rounded-md' />
				<Skeleton className='h-4 w-3/4 rounded-md' />
				<div className='space-y-2 pt-1'>
					<Skeleton className='h-11 w-full rounded-xl' />
					<Skeleton className='h-11 w-full rounded-xl' />
				</div>
			</div>
			<div className='space-y-3 rounded-2xl border border-border/70 bg-card p-5'>
				<Skeleton className='h-5 w-28 rounded-md' />
				<Skeleton className='h-4 w-full rounded-md' />
				<Skeleton className='h-11 w-full rounded-xl' />
				<Skeleton className='h-11 w-full rounded-xl' />
			</div>
			<div className='space-y-3 rounded-2xl bg-foreground/90 p-5'>
				<Skeleton className='h-6 w-40 rounded-md bg-background/20' />
				<Skeleton className='h-4 w-full rounded-md bg-background/15' />
				<Skeleton className='h-4 w-2/3 rounded-md bg-background/15' />
				<Skeleton className='mt-2 h-11 w-full rounded-xl bg-background/20' />
			</div>
		</aside>
	</div>
)
