import type { DecodedIdToken } from 'firebase-admin/auth'
import { uuidv7 } from 'uuidv7'
import { assignUserRole } from '@/lib/auth/roles'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function syncFirebaseUser(decodedToken: DecodedIdToken) {
	const supabase = createSupabaseAdmin()

	const {
		uid: firebaseUid,
		email,
		name,
		picture,
		phone_number,
		email_verified,
	} = decodedToken

	const fullName = name || decodedToken.name || 'Usuário'
	const nameParts = fullName.trim().split(' ')
	const firstName = nameParts[0]
	const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

	const { data: existingUser, error: selectError } = await supabase
		.from('users')
		.select('*')
		.eq('firebase_uid', firebaseUid)
		.maybeSingle()

	if (selectError) {
		throw selectError
	}

	if (existingUser) {
		const { data: updatedUser, error: updateError } = await supabase
			.from('users')
			.update({
				email: email ?? existingUser.email,
				first_name: firstName || existingUser.first_name,
				last_name: lastName || existingUser.last_name,
				avatar_url: picture ?? existingUser.avatar_url,
				phone_number: phone_number ?? existingUser.phone_number,
				email_verified: email_verified ?? existingUser.email_verified,
				updated_at: new Date().toISOString(),
			})
			.eq('firebase_uid', firebaseUid)
			.select('*')
			.single()

		if (updateError) {
			throw updateError
		}

		return updatedUser
	}

	const { data: newUser, error: insertError } = await supabase
		.from('users')
		.insert({
			id: uuidv7(),
			firebase_uid: firebaseUid,
			email: email ?? null,
			first_name: firstName,
			last_name: lastName,
			avatar_url: picture ?? null,
			phone_number: phone_number ?? null,
			email_verified: email_verified ?? false,
			status: 'ACTIVE',
		})
		.select('*')
		.single()

	if (insertError) {
		throw insertError
	}

	await assignUserRole(newUser.id as string, 'buyer')

	return newUser
}
