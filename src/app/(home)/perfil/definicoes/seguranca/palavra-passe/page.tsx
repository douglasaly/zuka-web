import { pageMetadata } from '@/lib/seo/metadata'
import { ChangePasswordView } from '@/modules/profile/ui/views/change-password-view'

export const metadata = pageMetadata({
	title: 'Alterar Senha',
	description: 'Alterar a senha do perfil',
	path: '/perfil/definicoes/seguranca/palavra-passe',
})

export default function ChangePasswordPage() {
	return <ChangePasswordView />
}
