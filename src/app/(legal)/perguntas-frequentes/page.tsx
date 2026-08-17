import { pageMetadata } from '@/lib/seo/metadata'
import { FaqView } from '@/modules/legal/ui/views/faq-view'

export const metadata = pageMetadata({
	title: 'Perguntas frequentes',
	description:
		'Respostas sobre conta, compras, lojas, pagamentos e privacidade na Zuka.',
	path: '/perguntas-frequentes',
})

export default function FaqPage() {
	return <FaqView />
}
