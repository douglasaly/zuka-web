'use client'
import { Button } from '@/components/ui/button'

type AdminAccountRowProps = {
	user: Record<string, unknown>
	removePending: boolean
	onRemove: (id: string) => void
}
export function AdminAccountRow({
	user,
	removePending,
	onRemove,
}: AdminAccountRowProps) {
	const roles = (user.roles as string[]) ?? []
	const hasAdminRole = roles.includes('admin')
	return (
		<div className='flex items-center justify-between gap-2 px-4 py-2.5'>
			<div className='flex items-center gap-2'>
				{user.avatar_url ? (
					<img
						src={user.avatar_url as string}
						alt=''
						className='size-7 rounded-full object-cover'
					/>
				) : (
					<div className='flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold uppercase'>
						{(user.first_name as string)?.[0] ?? '?'}
					</div>
				)}
				<div>
					<p className='text-sm font-medium'>
						{`${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()}
					</p>
					<p className='text-xs text-muted-foreground'>
						{user.email as string}
					</p>
				</div>
			</div>
			{hasAdminRole && (
				<Button
					size='sm'
					variant='outline'
					type='button'
					className='text-muted-foreground'
					onClick={() => onRemove(user.id as string)}
					disabled={removePending}
				>
					Remover admin
				</Button>
			)}
		</div>
	)
}
