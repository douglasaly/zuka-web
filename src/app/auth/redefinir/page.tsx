import { noIndexMetadata } from '@/lib/seo/metadata'
import { ResetPasswordFormView } from '@/modules/auth/reset-password-form-view'

export const metadata = {
	...noIndexMetadata,
	title: 'Redefinir palavra-passe',
}

export default function RedefinirPage() {
	return <ResetPasswordFormView />
}
