import { Suspense } from 'react'
import { ProfileView } from '@/modules/profile/ui/views/profile-view'

export default function ProfilePage() {
	return (
		<Suspense fallback={null}>
			<ProfileView />
		</Suspense>
	)
}
