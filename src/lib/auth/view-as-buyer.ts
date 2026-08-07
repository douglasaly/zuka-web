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

/**
 * Returns true only once per full page load (document lifetime).
 * Soft client navigations will not get another "first load" check.
 */
export function consumeSellerEntryCheck() {
	if (sellerEntryChecked) return false
	sellerEntryChecked = true
	return true
}

/** Paths where an active seller should land on the dashboard on first load. */
export function isSellerEntryPath(pathname: string) {
	return pathname === '/'
}
