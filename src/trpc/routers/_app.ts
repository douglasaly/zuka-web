import { authRouter } from '@/modules/auth/server/procedures'
import { createTRPCRouter } from '../init'
import { helloProcedure } from './hello'
export const appRouter = createTRPCRouter({
	hello: helloProcedure,
	auth: authRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
