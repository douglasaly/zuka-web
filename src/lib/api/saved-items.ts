import type { SavedItem } from '@/types/saved-items'

export async function FetchSavedItems(): Promise<SavedItem[]> {
	const res = await fetch('/api/saved-items', {
		credentials: 'include',
	})

	if (!res.ok) {
		throw new Error('Failed to load saved items')
	}

	const json: { items: SavedItem[] } = await res.json()

	return json.items ?? []
}

export async function DeleteSavedItem(itemId: string): Promise<void> {
	const res = await fetch(`/api/saved-items/${itemId}`, {
		method: 'DELETE',
		credentials: 'include',
	})

	if (!res.ok) {
		throw new Error('Falha ao deletar o item.')
	}
}

export async function CreateSavedItem(productId: string) {
	const res = await fetch(`/api/saved-items/${productId}`, {
		method: 'POST',
		credentials: 'include',
	})

	if (!res.ok) {
		throw new Error('Failed to save item')
	}

	return res.json()
}
