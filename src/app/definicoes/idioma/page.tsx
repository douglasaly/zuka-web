import { pageMetadata } from '@/lib/seo/metadata'
import { LanguageView } from '@/modules/profile/ui/views/language-view'

export const metadata = pageMetadata({
	title: 'Idioma',
	description:
		'A app está em português de Moçambique. Ainda não dá para mudar o idioma.',
	path: '/definicoes/idioma',
	index: false,
})

export default function LanguagePage() {
	return <LanguageView />
}
