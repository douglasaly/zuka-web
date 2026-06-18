import { z } from 'zod'
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init'

export const helloProcedure = createTRPCRouter({
	getHello: protectedProcedure
		.input(
			z.object({
				text: z.string(),
			})
		)
		.query(({ input, ctx }) => {
			const { dbUser, user } = ctx
			return {
				greeting: {
					message:'from route',
					dbUser,
					user,
				},
			}
		}),
})
