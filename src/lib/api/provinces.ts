export async function getProvinces() {
	const response = await fetch('/api/provinces', {
		method: 'GET',
	})

	if (!response.ok) {
		throw new Error('Fetch error')
	}

	return response.json()
}
