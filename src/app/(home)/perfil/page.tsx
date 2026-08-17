import { Suspense } from 'react'
import { pageMetadata } from '@/lib/seo/metadata'
import { ProfileView } from '@/modules/profile/ui/views/profile-view'

export const metadata = pageMetadata({
	title: 'Meu Perfil',
	description: 'Meu perfil de usuário',
	path: '/perfil',
})

export default function ProfilePage() {
	return (
		<Suspense fallback={null}>
			<ProfileView />
		</Suspense>
	)
}
