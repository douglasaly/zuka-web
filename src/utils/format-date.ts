/**
 * Formata datas para a buyer view: "31 de Julho de 2026".
 */
export function formatLongPtDate(iso: string | Date): string {
	const date = typeof iso === 'string' ? new Date(iso) : iso
	if (Number.isNaN(date.getTime())) return ''

	const raw = date.toLocaleDateString('pt-PT', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})

	// Locale devolve mês em minúsculas ("julho"); capitalizar a primeira letra.
	return raw.replace(
		/(\d{1,2})\s+de\s+(\p{L}+)\s+de\s+(\d{4})/u,
		(_match, day: string, month: string, year: string) => {
			const capitalized =
				month.charAt(0).toLocaleUpperCase('pt-PT') + month.slice(1)
			return `${day} de ${capitalized} de ${year}`
		}
	)
}

/** Data longa + hora: "31 de Julho de 2026 às 14:30" */
export function formatLongPtDateTime(iso: string | Date): string {
	const date = typeof iso === 'string' ? new Date(iso) : iso
	if (Number.isNaN(date.getTime())) return ''

	const time = date.toLocaleTimeString('pt-PT', {
		hour: '2-digit',
		minute: '2-digit',
	})

	return `${formatLongPtDate(date)} às ${time}`
}
