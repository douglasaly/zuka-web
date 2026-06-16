import { createTRPCRouter } from '../init'
import { helloProcedure } from './hello'
export const appRouter = createTRPCRouter({
	hello: helloProcedure,
})
// export type definition of API
export type AppRouter = typeof appRouter
