import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { roles } from '@/db/schema/roles'
import { userRoles } from '@/db/schema/user-roles'
import { users } from '@/db/schema/users'

export const registerUser = async (firebaseUser: {
	uid: string
	email?: string | null
	emailVerified?: boolean
	name?: string | null
	picture?: string | null
}) => {
	const existing = await db
		.select()
		.from(users)
		.where(eq(users.firebaseUid, firebaseUser.uid))
		.limit(1)
		.then((result) => result[0])

	if (existing) {
		return null
	}

	const [created] = await db
		.insert(users)
		.values({
			firebaseUid: firebaseUser.uid,
			email: firebaseUser.email ?? null,

			firstName: firebaseUser.name
				? firebaseUser.name.split(' ')[0]
				: null,
			lastName: firebaseUser.name
				? firebaseUser.name.split(' ').slice(1).join(' ') || null
				: null,

			avatarUrl: firebaseUser.picture ?? null,

			emailVerified: firebaseUser.emailVerified ?? false,

			status: 'ACTIVE',
		})
		.returning()

	const buyerRole = await db
		.select()
		.from(roles)
		.where(eq(roles.name, 'buyer'))
		.limit(1)
		.then((res) => res[0])

	if (buyerRole) {
		await db.insert(userRoles).values({
			userId: created.id,
			roleId: buyerRole.id,
		})
	}

	return created
}
