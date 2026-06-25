import { cookies } from 'next/headers'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { adminAuth } from '@/lib/firebase/firebase-admin'
import { SESSION_COOKIE } from '@/utils/constants'

export async function getSessionFirebaseUid() {
	const session = (await cookies()).get(SESSION_COOKIE)?.value
	if (!session) return null

	const decoded = await adminAuth.verifySessionCookie(session, true)
	return decoded.uid
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
	return data
}

export async function requireSessionUser() {
	const user = await getSessionUser()
	if (!user) {
		throw new Response('Unauthorized', { status: 401 })
	}
	return user
}
