import type { Metadata } from 'next'
import { ForbiddenView } from '@/modules/auth/ui/views/forbidden-view'

export const metadata: Metadata = {
	title: 'Área restrita',
	description: 'Esta página é reservada à equipe Zuka.',
	robots: { index: false, follow: false },
}

export default function AreaRestritaPage() {
	return <ForbiddenView />
}
