export function monogram(name: string) {
	const letter = name.trim().charAt(0)
	return letter ? letter.toLocaleUpperCase('pt-PT') : '?'
}
