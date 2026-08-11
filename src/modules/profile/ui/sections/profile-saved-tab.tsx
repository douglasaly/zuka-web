import { Heart } from 'lucide-react'
import type { SavedItem } from '@/types/saved-items'
import { EmptyState } from '../components/empty-state'
import { SavedItemCard } from '../components/saved-item-card'
import { SavedItemCardSkeleton } from '../components/saved-item-card-skeleton'

type ProfileSavedTabProps = {
	savedItems: SavedItem[]
	isLoading: boolean
	isRemoving: boolean
	onRemove: (itemId: string) => void
}

export function ProfileSavedTab({
	savedItems,
	isLoading,
	isRemoving,
	onRemove,
}: ProfileSavedTabProps) {
	return (
		<div className='flex flex-wrap gap-3'>
			{isLoading ? (
				<div className='flex flex-wrap gap-3'>
					{Array.from({ length: 6 }).map((_, i) => (
						<SavedItemCardSkeleton key={i} />
					))}
				</div>
			) : savedItems.length === 0 ? (
				<div className='w-full'>
					<EmptyState
						icon={Heart}
						title='Ainda não guardou nada'
						description='Toque no coração de um produto para o guardar aqui'
					/>
				</div>
			) : (
				savedItems.map((item) => (
					<SavedItemCard
						key={item.id}
						item={item}
						onRemove={() => onRemove(item.id)}
						isRemoving={isRemoving}
					/>
				))
			)}
		</div>
	)
}
