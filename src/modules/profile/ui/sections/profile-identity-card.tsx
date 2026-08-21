import { BadgeCheck } from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'
import type { UserProfile } from '@/types'
import { ProfileStats } from '../components/profile-stats'

type ProfileStat = {
	label: string
	value: number
	isLoading?: boolean
}
type ProfileIdentityCardProps = {
	profile: UserProfile
	displayName: string
	isSeller: boolean
	stats: ProfileStat[]
}
export function ProfileIdentityCard({
	profile,
	displayName,
	isSeller,
	stats,
}: ProfileIdentityCardProps) {
	return (
		<div className='rounded-2xl border border-border/60 bg-card p-5'>
			<div className='flex gap-4'>
				<UserAvatar
					imageUrl={profile.avatarUrl}
					name={displayName}
					size='xl'
				/>

				<div>
					<div className='flex gap-1 items-baseline'>
						<p className='text-lg font-semibold'>{displayName}</p>
						{profile.emailVerified && (
							<BadgeCheck className='size-4 text-white bg-green-400 rounded-full' />
						)}
					</div>
					<p className='text-sm text-muted-foreground'>
						{profile.email}
					</p>
					<p className='mt-2 text-xs text-muted-foreground'>
						Perfil:{' '}
						{isSeller ? 'Comprador e vendedor' : 'Comprador'}
					</p>
				</div>
			</div>

			<ProfileStats stats={stats} />
		</div>
	)
}
