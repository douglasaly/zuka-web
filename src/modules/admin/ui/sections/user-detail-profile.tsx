import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type UserDetailHeaderProps = {
	user: Record<string, unknown>
}

export function UserDetailHeader({ user }: UserDetailHeaderProps) {
	return (
		<div className='flex items-center gap-3'>
			<Button
				render={
					<Link href='/admin/users'>
						<ArrowLeft className='size-4' />
					</Link>
				}
				variant='ghost'
				size='sm'
			/>
			<div className='flex items-center gap-3'>
				{user.avatar_url ? (
					<img
						src={user.avatar_url as string}
						alt=''
						className='size-12 rounded-full object-cover border border-border'
					/>
				) : (
					<div className='flex size-12 items-center justify-center rounded-full bg-muted font-bold text-lg uppercase'>
						{(user.first_name as string)?.[0] ?? '?'}
					</div>
				)}
				<div>
					<p className='font-heading font-bold'>
						{`${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()}
					</p>
					<p className='text-sm text-muted-foreground'>
						{user.email as string}
					</p>
				</div>
			</div>
		</div>
	)
}
