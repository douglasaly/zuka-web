import { Skeleton } from '@/components/ui/skeleton'

export const SettingsSkeleton = () => {
	return (
		<div className='mx-auto max-w-2xl space-y-8 px-4 py-8 md:py-12'>
			<Skeleton className='h-8 w-40 rounded-md' />

			{/* CONTA */}
			<section className='space-y-3'>
				<div className='space-y-1.5'>
					<Skeleton className='h-5 w-24 rounded-md' />
					<Skeleton className='h-4 w-48 rounded-md' />
				</div>

				<div className='rounded-xl border bg-card p-4'>
					<div className='grid gap-4 sm:grid-cols-2'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className='space-y-1.5'>
								<Skeleton className='h-3.5 w-16 rounded-md' />
								<Skeleton className='h-9 w-full rounded-md' />
							</div>
						))}
					</div>

					<div className='mt-4 flex justify-end'>
						<Skeleton className='h-9 w-36 rounded-md' />
					</div>
				</div>
			</section>

			{/* GERAL */}
			<section className='space-y-3'>
				<Skeleton className='h-5 w-16 rounded-md' />

				<div className='overflow-hidden rounded-xl border bg-card'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className='flex items-center gap-3 border-b px-4 py-3.5 last:border-b-0'
						>
							<Skeleton className='size-5 shrink-0 rounded-md' />
							<div className='flex-1 space-y-1.5'>
								<Skeleton className='h-4 w-32 rounded-md' />
								<Skeleton className='h-3 w-44 rounded-md' />
							</div>
							<Skeleton className='size-4 shrink-0 rounded-md' />
						</div>
					))}
				</div>
			</section>

			{/* NOTIFICAÇÕES */}
			<section className='space-y-3'>
				<div className='space-y-1.5'>
					<Skeleton className='h-5 w-32 rounded-md' />
					<Skeleton className='h-4 w-40 rounded-md' />
				</div>

				<div className='overflow-hidden rounded-xl border bg-card'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className='flex items-center gap-3 border-b px-4 py-3.5 last:border-b-0'
						>
							<div className='flex-1 space-y-1.5'>
								<Skeleton className='h-4 w-40 rounded-md' />
								<Skeleton className='h-3 w-56 rounded-md' />
							</div>
							<Skeleton className='h-5 w-9 shrink-0 rounded-full' />
						</div>
					))}
				</div>
			</section>

			{/* PRIVACIDADE */}
			<section className='space-y-3'>
				<Skeleton className='h-5 w-28 rounded-md' />

				<div className='overflow-hidden rounded-xl border bg-card'>
					{Array.from({ length: 2 }).map((_, i) => (
						<div
							key={i}
							className='flex items-center gap-3 border-b px-4 py-3.5 last:border-b-0'
						>
							<div className='flex-1 space-y-1.5'>
								<Skeleton className='h-4 w-36 rounded-md' />
								<Skeleton className='h-3 w-48 rounded-md' />
							</div>
							<Skeleton className='h-5 w-9 shrink-0 rounded-full' />
						</div>
					))}
				</div>
			</section>

			{/* SEGURANÇA */}
			<section className='space-y-3'>
				<Skeleton className='h-5 w-24 rounded-md' />

				<div className='overflow-hidden rounded-xl border bg-card'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className='flex items-center gap-3 border-b px-4 py-3.5 last:border-b-0'
						>
							<Skeleton className='size-5 shrink-0 rounded-md' />
							<div className='flex-1 space-y-1.5'>
								<Skeleton className='h-4 w-44 rounded-md' />
								<Skeleton className='h-3 w-32 rounded-md' />
							</div>
							<Skeleton className='size-4 shrink-0 rounded-md' />
						</div>
					))}
				</div>
			</section>

			{/* ZONA DE PERIGO */}
			<section className='space-y-3'>
				<div className='space-y-1.5'>
					<Skeleton className='h-5 w-32 rounded-md' />
					<Skeleton className='h-4 w-56 rounded-md' />
				</div>

				<div className='rounded-xl border border-destructive/30 bg-destructive/5 p-4'>
					<Skeleton className='h-8 w-32 rounded-md' />
				</div>
			</section>
		</div>
	)
}
