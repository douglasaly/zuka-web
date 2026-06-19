import { z } from 'zod'

const provincesSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	createdAt: z.date().nullable(),
	updatedAt: z.date().nullable(),
})

export type Province = z.infer<typeof provincesSchema>
