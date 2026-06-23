export const formatPrice = (value: number, currency = 'MZN') => {
	return new Intl.NumberFormat('pt-pt', {
		style: 'currency',
		currency,
		maximumFractionDigits: 0,
	}).format(value / 100) 
}
