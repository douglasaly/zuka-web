import { noIndexMetadata } from '@/lib/seo/metadata'

export const metadata = noIndexMetadata

export default function PerfilLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
