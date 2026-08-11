function localDayKey(d: Date) {
	return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function dayKey(iso: string) {
	return localDayKey(new Date(iso))
}

export function dayLabel(iso: string) {
	const d = new Date(iso)
	const today = new Date()
	const yesterday = new Date()
	yesterday.setDate(today.getDate() - 1)

	if (dayKey(iso) === localDayKey(today)) return 'Hoje'
	if (dayKey(iso) === localDayKey(yesterday)) return 'Ontem'
	return d.toLocaleDateString('pt-PT', {
		day: 'numeric',
		month: 'short',
		year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric',
	})
}
