import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { uuidv7 } from 'uuidv7'
import type { UploadPurpose } from '@/types/uploads'

export type { UploadPurpose } from '@/types/uploads'

const ALLOWED_CONTENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const CONTENT_TYPE_EXTENSION: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
}

function requireEnv(name: string): string {
	const value = process.env[name]
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`)
	}
	return value
}

function getR2Client() {
	return new S3Client({
		region: 'auto',
		endpoint: `https://${requireEnv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
			secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
		},
	})
}

export function getR2BucketName() {
	return requireEnv('R2_BUCKET_NAME')
}

export function getR2PublicBaseUrl() {
	return requireEnv('R2_PUBLIC_URL').replace(/\/$/, '')
}

export function isAllowedImageContentType(contentType: string) {
	return ALLOWED_CONTENT_TYPES.has(contentType)
}

export function extensionForContentType(contentType: string) {
	return CONTENT_TYPE_EXTENSION[contentType] ?? null
}

export function buildObjectKey(
	purpose: UploadPurpose,
	userId: string,
	extension: string
) {
	const id = uuidv7()

	switch (purpose) {
		case 'store-logo':
			return `stores/${userId}/logo-${id}.${extension}`
		case 'store-banner':
			return `stores/${userId}/banner-${id}.${extension}`
		case 'product-image':
			return `products/${userId}/${id}.${extension}`
		case 'verification-id':
			return `verification/${userId}/id-card-${id}.${extension}`
		case 'verification-selfie':
			return `verification/${userId}/selfie-${id}.${extension}`
		default:
			return `uploads/${userId}/${id}.${extension}`
	}
}

export function getPublicUrl(key: string) {
	return `${getR2PublicBaseUrl()}/${key}`
}

export function isR2PublicUrl(url: string | null | undefined) {
	if (!url) return false
	if (url.startsWith('data:')) return false

	try {
		const base = getR2PublicBaseUrl()
		return url === base || url.startsWith(`${base}/`)
	} catch {
		return false
	}
}

export async function createPresignedUploadUrl(
	key: string,
	contentType: string
) {
	const client = getR2Client()
	const command = new PutObjectCommand({
		Bucket: getR2BucketName(),
		Key: key,
		ContentType: contentType,
	})

	const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 })

	return {
		uploadUrl,
		publicUrl: getPublicUrl(key),
		key,
	}
}

export function assertR2PublicUrl(
	url: string | null | undefined,
	fieldName: string
) {
	if (!url) return

	if (!isR2PublicUrl(url)) {
		throw new Error(`${fieldName} must be an image uploaded to storage`)
	}
}
