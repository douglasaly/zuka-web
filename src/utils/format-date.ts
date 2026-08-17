export function formatLongPtDate(iso: string | Date): string {
	const date = typeof iso === 'string' ? new Date(iso) : iso
	if (Number.isNaN(date.getTime())) return ''
	const raw = date.toLocaleDateString('pt-PT', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
	return raw.replace(
		/(\d{1,2})\s+de\s+(\p{L}+)\s+de\s+(\d{4})/u,
		(_match, day: string, month: string, year: string) => {
			const capitalized =
				month.charAt(0).toLocaleUpperCase('pt-PT') + month.slice(1)
			return `${day} de ${capitalized} de ${year}`
		}
	)
}
export function formatLongPtDateTime(iso: string | Date): string {
	const date = typeof iso === 'string' ? new Date(iso) : iso
	if (Number.isNaN(date.getTime())) return ''
	const time = date.toLocaleTimeString('pt-PT', {
		hour: '2-digit',
		minute: '2-digit',
	})
	return `${formatLongPtDate(date)} às ${time}`
}
