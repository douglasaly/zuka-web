import { TRPCError } from "@trpc/server"
import { t } from "../init"

export const isAuthenticated = t.middleware(({ ctx, next }) => {
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