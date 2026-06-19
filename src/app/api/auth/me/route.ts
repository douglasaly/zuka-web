import { getAuth } from 'firebase-admin/auth'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/utils/constants'
import { db } from '@/db'
import { users } from '@/db/schema/users'
import { eq } from 'drizzle-orm'

export async function GET() {
	const session = (await cookies()).get(SESSION_COOKIE)?.value

	if (!session) {
		return new Response('Unauthorized', { status: 401 })
	}

	const decoded = await getAuth().verifySessionCookie(session, true)

	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.firebaseUid, decoded.uid))

	return Response.json({
		user,
	})
}
