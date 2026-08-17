import { pageMetadata } from '@/lib/seo/metadata'
import { TermsOfUseView } from '@/modules/legal/ui/views/terms-of-use-view'

export const metadata = pageMetadata({
	title: 'Termos e Condições de Utilização',
	description:
		'Regras de uso do Zuka para compradores e vendedores em Moçambique.',
	path: '/termos-e-condicoes',
})

export default function TermsPage() {
	return <TermsOfUseView />
}
