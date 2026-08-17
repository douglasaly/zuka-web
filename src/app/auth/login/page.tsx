import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo/metadata'
import LoginView from '@/modules/auth/ui/views/login-view'

export const metadata: Metadata = pageMetadata({
	title: 'Entrar',
	description: 'Entre na sua conta Zuka para comprar ou gerir a sua loja.',
	path: '/auth/login',
})

export default function LoginPage() {
	return <LoginView />
}
