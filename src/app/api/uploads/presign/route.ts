import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import {
	buildObjectKey,
	createPresignedUploadUrl,
	extensionForContentType,
	isAllowedImageContentType,
	type UploadPurpose,
} from '@/lib/storage/r2'

const ALLOWED_PURPOSES = new Set<UploadPurpose>([
	'store-logo',
	'store-banner',
	'product-image',
	'verification-id',
	'verification-selfie',
])

export async function POST(request: Request) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const purpose = body.purpose as UploadPurpose
		const contentType = String(body.contentType ?? '')

		if (!ALLOWED_PURPOSES.has(purpose)) {
			return NextResponse.json({ error: 'Invalid upload purpose' }, { status: 400 })
		}

		if (!isAllowedImageContentType(contentType)) {
			return NextResponse.json(
				{ error: 'Only JPG, PNG, and WebP images are allowed' },
				{ status: 400 }
			)
		}

		const extension = extensionForContentType(contentType)
		if (!extension) {
			return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 })
		}

		const key = buildObjectKey(purpose, user.id as string, extension)
		const result = await createPresignedUploadUrl(key, contentType)

		return NextResponse.json(result)
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to prepare image upload' },
			{ status: 500 }
		)
	}
}
