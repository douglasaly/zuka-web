import { Skeleton } from '@/components/ui/skeleton'

export const ProfileSkeleton = () => {
	return (
		<div className='mx-auto max-w-4xl px-4 py-8 md:py-12'>
			<Skeleton className='mb-6 h-8 w-48 rounded-md' />

			<div className='space-y-4'>
				{/* PERFIL */}
				<div className='rounded-2xl border border-border/60 bg-card p-5'>
					<div className='flex gap-4'>
						<Skeleton className='size-16 shrink-0 rounded-full' />

						<div className='flex-1 space-y-2'>
							<Skeleton className='h-5 w-40 rounded-md' />
							<Skeleton className='h-4 w-52 rounded-md' />
							<Skeleton className='h-3 w-32 rounded-md' />
						</div>
					</div>

					<div className='pt-10 mb-2 flex gap-6'>
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className='flex flex-col gap-1.5'>
								<Skeleton className='h-4 w-6 rounded-md' />
								<Skeleton className='h-3 w-16 rounded-md' />
							</div>
						))}
					</div>
				</div>

				{/* TABS */}
				<div className='flex flex-col w-full gap-4'>
					<Skeleton className='h-10 w-full rounded-md' />

					<div className='flex flex-wrap gap-3'>
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className='w-40 space-y-2 sm:w-44'>
								<Skeleton className='aspect-square w-full rounded-xl' />
								<Skeleton className='h-4 w-full rounded-md' />
								<Skeleton className='h-3 w-2/3 rounded-md' />
								<Skeleton className='h-4 w-1/2 rounded-md' />
							</div>
						))}
					</div>
				</div>

				{/* AÇÕES */}
				<div className='grid gap-3 sm:grid-cols-2'>
					{Array.from({ length: 2 }).map((_, i) => (
						<Skeleton key={i} className='h-17 w-full rounded-2xl' />
					))}
				</div>

				{/* OPÇÕES */}
				<div className='flex flex-col w-full min-w-0 gap-px overflow-hidden rounded-xl border'>
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton
							key={i}
							className='h-12 w-full rounded-none'
						/>
					))}
				</div>
			</div>
		</div>
	)
}
