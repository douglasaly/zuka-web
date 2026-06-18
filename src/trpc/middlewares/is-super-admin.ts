import { TRPCError } from "@trpc/server"
import { t } from "../init"

export const isSuperAdmin =
	t.middleware(({ ctx, next }) => {
		if (
			!ctx.roles.includes('super_admin')
		) {
			throw new TRPCError({
				code: 'FORBIDDEN',
			})
		}

		return next({ ctx })
	})

