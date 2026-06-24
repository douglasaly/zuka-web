import type { UploadPurpose } from '@/types/uploads'

export async function uploadImageToR2(
	file: File,
	purpose: UploadPurpose
): Promise<string> {
	const presignRes = await fetch('/api/uploads/presign', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			purpose,
			contentType: file.type,
		}),
	})

	const presignJson = await presignRes.json()
	if (!presignRes.ok) {
		throw new Error(presignJson.error ?? 'Failed to prepare upload')
	}

	const uploadRes = await fetch(presignJson.uploadUrl, {
		method: 'PUT',
		body: file,
		headers: { 'Content-Type': file.type },
	})

	if (!uploadRes.ok) {
		throw new Error('Failed to upload image to storage')
	}

	return presignJson.publicUrl as string
}
