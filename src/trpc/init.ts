import { initTRPC, TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import * as admin from 'firebase-admin'
import { cookies } from 'next/headers'
import superjson from 'superjson'
import { db } from '@/db'
import { roles } from '@/db/schema/roles'
import { userRoles } from '@/db/schema/user-roles'
import { users } from '@/db/schema/users'
import { adminAuth } from '@/lib/firebase-admin'
import { SESSION_COOKIE } from '@/utils/constants'
import { isAuthenticated } from './middlewares/is-authenticated'
import { isAdmin } from './middlewares/is-admin'
import { isSuperAdmin } from './middlewares/is-super-admin'
import { permissions } from '@/db/schema/permissions'
import { rolePermissions } from '@/db/schema/role-permissions'

const app = admin.getApps()
if (!app.length) {
	admin.initializeApp({
		credential: admin.applicationDefault(),
	})
}

export async function createTRPCContext() {
	const cookieStore = cookies()
	const sessionCookie = (await cookieStore).get(SESSION_COOKIE)?.value

	let user = null
	let dbUser = null
	let rolesList: string[] = []
	let permissionsList: string[] = []

	if (sessionCookie) {
		try {
			const decoded = await adminAuth.verifySessionCookie(
				sessionCookie,
				true
			)

			user = {
				uid: decoded.uid,
				email: decoded.email,
			}

			const [foundUser] = await db
				.select()
				.from(users)
				.where(eq(users.firebaseUid, decoded.uid))
				.limit(1)

			dbUser = foundUser ?? null

			if (dbUser) {
				const result = await db
					.select({
						role: roles.name,
					})
					.from(userRoles)
					.innerJoin(roles, eq(userRoles.roleId, roles.id))
					.where(eq(userRoles.userId, dbUser.id))

				rolesList = result.map((r) => r.role)

				const permissionsResult = await db
					.select({
						key: permissions.key,
					})
					.from(userRoles)
					.innerJoin(
						rolePermissions,
						eq(userRoles.roleId, rolePermissions.roleId)
					)
					.innerJoin(
						permissions,
						eq(rolePermissions.permissionId, permissions.id)
					)
					.where(eq(userRoles.userId, dbUser.id))

				permissionsList = permissionsResult.map((p) => p.key)
			}
		} catch (error) {
			console.error('Sessão inválida:', error)
		}
	}

	return {
		user,
		dbUser,
		roles: rolesList,
		permissions: permissionsList,
	}
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

export const t = initTRPC.context<Context>().create({
	transformer: superjson,
})

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure

export const protectedProcedure = t.procedure.use(isAuthenticated)
export const adminProcedure = protectedProcedure.use(isAdmin)
export const superAdminProcedure = protectedProcedure.use(isSuperAdmin)
