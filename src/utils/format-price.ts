export const formatPrice = (value: number, currency = 'MZN') => {
	const formatted = new Intl.NumberFormat('pt-pt', {
		maximumFractionDigits: 0,
	})
		.format(value)
		.replace(/\u00A0/g, '.')
	return `${formatted} ${currency}`
}
