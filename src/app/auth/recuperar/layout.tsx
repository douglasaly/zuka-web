import { noIndexMetadata } from '@/lib/seo/metadata'

export const metadata = {
	...noIndexMetadata,
	title: 'Recuperar palavra-passe',
}

export default function RecuperarLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
