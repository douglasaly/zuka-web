import { initTRPC, TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import * as admin from 'firebase-admin'
import { cookies } from 'next/headers'
import superjson from 'superjson'
import { db } from '@/db'
import { permissions } from '@/db/schema/permissions'
import { rolePermissions } from '@/db/schema/role-permissions'
import { roles } from '@/db/schema/roles'
import { userRoles } from '@/db/schema/user-roles'
import { users } from '@/db/schema/users'
import { adminAuth } from '@/lib/firebase-admin'
import { SESSION_COOKIE } from '@/utils/constants'

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

			if (!foundUser) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
				})
			}

			dbUser = foundUser

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
	// transformer: superjson,
})

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure

/**
 * MIDDLEWARES
 */

const isAuthenticated = t.middleware(({ ctx, next }) => {
	if (!ctx.user) {
		//|| !ctx.dbUser
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Acesso negado. Usuário inválido ou não registrado.',
		})
	}

	return next({
		ctx: {
			user: ctx.user,
			dbUser: ctx.dbUser, // ctx.dbUser agora é fortemente tipado com o seu Model do Prisma!
		},
	})
})

export const isAdmin = t.middleware(({ ctx, next }) => {
	if (!ctx.roles.includes('admin')) {
		throw new TRPCError({
			code: 'FORBIDDEN',
		})
	}

	return next({ ctx })
})

export const isSuperAdmin = t.middleware(({ ctx, next }) => {
	if (!ctx.roles.includes('super_admin')) {
		throw new TRPCError({
			code: 'FORBIDDEN',
		})
	}

	return next({ ctx })
})

export const protectedProcedure = t.procedure.use(isAuthenticated)
export const adminProcedure = protectedProcedure.use(isAdmin)
export const superAdminProcedure = protectedProcedure.use(isSuperAdmin)
