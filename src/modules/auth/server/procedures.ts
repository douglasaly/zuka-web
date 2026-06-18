import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { roles } from '@/db/schema/roles'
import { userRoles } from '@/db/schema/user-roles'
import { users } from '@/db/schema/users'
import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
} from '@/trpc/init'
import { registerUser } from '@/utils/register-user'

export const authRouter = createTRPCRouter({
	syncUser: protectedProcedure.mutation(async ({ ctx }) => {
		const { user: firebaseUser } = ctx

		if (!firebaseUser) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
			})
		}

		const [dbUser] = await db
			.select()
			.from(users)
			.where(eq(users.firebaseUid, firebaseUser.uid))

		if (dbUser) return null

		const newUser = await registerUser(firebaseUser)

		if (!newUser) {
			return null
		}

		return {
			id: newUser.id,
			firebaseUid: newUser.firebaseUid,
			email: newUser.email,
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			avatarUrl: newUser.avatarUrl,
			emailVerified: newUser.emailVerified,
			status: newUser.status,
		}
	}),
	upgradeToSeller: adminProcedure
		.input(z.object({ userId: z.string() }))
		.mutation(async ({ input }) => {
			const [sellerRole] = await db
				.select()
				.from(roles)
				.where(eq(roles.name, 'seller'))

			await db.insert(userRoles).values({
				userId: input.userId,
				roleId: sellerRole!.id,
			})
		}),
})
