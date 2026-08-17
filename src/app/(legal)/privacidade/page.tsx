import { pageMetadata } from '@/lib/seo/metadata'
import { PrivacyPolicyView } from '@/modules/legal/ui/views/privacy-policy-view'

export const metadata = pageMetadata({
	title: 'Política de Privacidade',
	description:
		'O que o Zuka e a NORTHBRIDGE LABS fazem com os seus dados pessoais e como pode exercer os seus direitos.',
	path: '/privacidade',
})

export default function PrivacyPage() {
	return <PrivacyPolicyView />
}
