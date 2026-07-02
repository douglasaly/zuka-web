import type { Categories } from '@/modules/home/ui/sections/categories-section'

export async function getCategories() {
	const response = await fetch('/api/categories', {
		method: 'GET',
	})

	if (!response.ok) {
		throw new Error('Fetch error')
	}

	return response.json() as Promise<Categories[]>
}
