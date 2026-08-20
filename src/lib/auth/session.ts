import { getFirebaseUidFromRequest } from '@/lib/auth/firebase-token'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
export async function getSessionFirebaseUid() {
	return getFirebaseUidFromRequest()
}
export async function getSessionUser() {
	const firebaseUid = await getSessionFirebaseUid()
	if (!firebaseUid) return null
	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase
		.from('users')
		.select('*')
		.eq('firebase_uid', firebaseUid)
		.maybeSingle()
	if (error) throw error
	if (!data || data.deleted_at) return null
	return data
}
export async function requireSessionUser() {
	const user = await getSessionUser()
	if (!user) {
		throw new Response('Unauthorized', { status: 401 })
	}
	return user
}
