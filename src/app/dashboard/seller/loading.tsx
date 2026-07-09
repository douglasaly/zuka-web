export default function SellerDashboardLoading() {
	return (
		<div className='space-y-6 p-8'>
			<div className='h-32 animate-pulse rounded-2xl bg-muted' />
			<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className='h-24 animate-pulse rounded-xl bg-muted'
					/>
				))}
			</div>
			<div className='flex gap-4'>
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className='h-10 flex-1 animate-pulse rounded-lg bg-muted'
					/>
				))}
			</div>
			<div className='space-y-3'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className='h-16 animate-pulse rounded-xl bg-muted'
					/>
				))}
			</div>
		</div>
	)
}
