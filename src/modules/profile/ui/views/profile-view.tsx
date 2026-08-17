'use client'
import {
	PROFILE_OPTIONS,
	PROFILE_TABS,
	useProfile,
} from '../../hooks/use-profile'
import { ProfileSkeleton } from '../components/profile-skeleton'
import { SegmentedTabs } from '../components/segmented-tabs'
import { ProfileActions } from '../sections/profile-actions'
import { ProfileFollowedTab } from '../sections/profile-followed-tab'
import { ProfileIdentityCard } from '../sections/profile-identity-card'
import { ProfileOptions } from '../sections/profile-options'
import { ProfileSavedTab } from '../sections/profile-saved-tab'
import { ProfileUnauth } from '../sections/profile-unauth'
export const ProfileView = () => {
	const p = useProfile()
	if (p.isLoading) {
		return <ProfileSkeleton />
	}
	if (!p.isAuthenticated || !p.profile) {
		return <ProfileUnauth />
	}
	return (
		<div className='mx-auto max-w-4xl px-4 py-8 md:py-12'>
			<h1 className='mb-6 font-heading text-2xl font-bold md:text-3xl'>
				O meu perfil
			</h1>

			<div className='space-y-4'>
				<ProfileIdentityCard
					profile={p.profile}
					displayName={p.displayName}
					isSeller={p.isSeller}
					stats={p.stats}
				/>

				<div className='flex flex-col w-full gap-4'>
					<SegmentedTabs
						tabs={[...PROFILE_TABS]}
						value={p.tab}
						onChange={p.handleSetTab}
					/>

					{p.tab === 'Guardados' && (
						<ProfileSavedTab
							savedItems={p.savedItems}
							isLoading={p.isSavedItemsLoading}
							isRemoving={p.isRemoving}
							onRemove={p.handleRemoveItem}
						/>
					)}

					{p.tab === 'Lojas seguidas' && (
						<ProfileFollowedTab
							stores={p.normalizedStores}
							rawCount={p.followedStores.length}
							isLoading={p.isFollowedStoresLoading}
						/>
					)}
				</div>

				<ProfileActions profile={p.profile} isSeller={p.isSeller} />

				<ProfileOptions options={PROFILE_OPTIONS} />
			</div>
		</div>
	)
}
