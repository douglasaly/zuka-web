import { TRPCError } from "@trpc/server"
import { protectedProcedure, t } from "../init"

export const isAdmin =
	t.middleware(({ ctx, next }) => {
		if (!ctx.roles.includes('admin')) {
			throw new TRPCError({
				code: 'FORBIDDEN',
			})
		}

		return next({ ctx })
	})

export const adminProcedure =
	protectedProcedure.use(isAdmin)