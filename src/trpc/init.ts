
import { initTRPC, TRPCError } from '@trpc/server'
import * as admin from 'firebase-admin'
import SuperJSON from 'superjson'
import { db } from '@/db'

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.applicationDefault(),
	})
}

export const createTRPCContext = async (opts: { headers: Headers }) => {
	const authHeader = opts.headers.get('authorization')

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return { user: null, dbUser: null }
	}

	const token = authHeader.split(' ')[1]

	// try {
	// 	// Validar o token gerado
	// 	const decodedToken = await admin.auth().verifyIdToken(token)

	// 	// Buscar por user na db
	// 	const dbUser = await db

	// 	return {
	// 		user: decodedToken,
	// 		dbUser: dbUser,
	// 	}
	// } catch (error) {
	// 	console.error('Erro na autenticação ou ao consultar o Prisma:', error)
	// 	return { user: null, dbUser: null }
	// }
}

const t = initTRPC
	.context<Awaited<ReturnType<typeof createTRPCContext>>>()
	.create({
		transformer: SuperJSON,
	})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure

/**
 * Middleware de Autenticação
 */
const isAuthenticated = t.middleware(({ ctx, next }) => {
	if (!ctx.user || !ctx.dbUser) {
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

export const protectedProcedure = t.procedure.use(isAuthenticated)
