export type UploadPurpose =
	| 'store-logo'
	| 'store-banner'
	| 'product-image'
	| 'verification-id'
	| 'verification-selfie'
	| 'avatar'
export type PresignInput = {
	purpose: UploadPurpose
	contentType: 'image/jpeg' | 'image/png' | 'image/webp'
}
export type PresignOutput = {
	uploadUrl: string
	publicUrl: string
	key: string
}
