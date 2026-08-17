import { pageMetadata } from '@/lib/seo/metadata'
import { SettingsView } from '@/modules/profile/ui/views/settings-view'

export const metadata = pageMetadata({
	title: 'Definições',
	description: 'Definições do perfil',
	path: '/perfil/definicoes',
})

const Page = () => {
	return <SettingsView />
}
export default Page
