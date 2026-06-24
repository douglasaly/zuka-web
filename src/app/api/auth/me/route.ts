import { cookies } from 'next/headers'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { adminAuth } from '@/lib/firebase/firebase-admin'
import { SESSION_COOKIE } from '@/utils/constants'

export async function GET() {
	const session = (await cookies()).get(SESSION_COOKIE)?.value

	if (!session) {
		return new Response('Unauthorized', { status: 401 })
	}

	const decoded = await adminAuth.verifySessionCookie(session, true)

	const supabase = createSupabaseAdmin()
	const { data: user, error } = await supabase
		.from('users')
		.select('*')
		.eq('firebase_uid', decoded.uid)
		.maybeSingle()

	if (error) {
		return new Response('Internal Server Error', { status: 500 })
	}

	return Response.json({ user })
}
