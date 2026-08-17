import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
export function formatDay(date: string) {
	try {
		return format(new Date(date), 'd MMM', { locale: pt })
	} catch {
		return date
	}
}
