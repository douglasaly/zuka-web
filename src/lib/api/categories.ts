import type { Categories } from '@/modules/home/ui/sections/categories-section'
export async function getCategories(): Promise<Categories[]> {
	const response = await fetch('/api/categories', {
		method: 'GET',
	})
	if (!response.ok) {
		throw new Error('Fetch error')
	}
	const json = await response.json()
	return json.data ?? json
}
