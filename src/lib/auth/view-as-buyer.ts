let viewAsBuyer = false
let sellerEntryChecked = false
export function setViewAsBuyerMode() {
	viewAsBuyer = true
}
export function clearViewAsBuyerMode() {
	viewAsBuyer = false
}
export function isViewAsBuyerMode() {
	return viewAsBuyer
}
export function consumeSellerEntryCheck() {
	if (sellerEntryChecked) return false
	sellerEntryChecked = true
	return true
}
export function isSellerEntryPath(pathname: string) {
	return pathname === '/'
}
