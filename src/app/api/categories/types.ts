import { z } from 'zod'

const categoriesSchema = z.object({
	createdAt: z.date().nullable(),
	updatedAt: z.date().nullable(),
	deletedAt: z.date().nullable(),
	id: z.string(),
	parentId: z.string().nullable(),
	name: z.string(),
	slug: z.string(),
})

export type Category = z.infer<typeof categoriesSchema>
