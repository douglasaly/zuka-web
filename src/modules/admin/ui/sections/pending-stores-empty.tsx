import { Clock } from 'lucide-react'
import { EmptyState } from '../components/empty-state'

export function PendingStoresEmpty() {
	return (
		<EmptyState
			icon={Clock}
			message='Nenhuma loja aguarda aprovação neste momento.'
		/>
	)
}
