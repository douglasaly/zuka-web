export function getInitials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((word) => word[0].toUpperCase())
		.slice(0, 2)
		.join('')
}
