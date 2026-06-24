import { z } from 'zod'

const categoriesSchema = z.object({
	createdAt: z.string().nullable(),
	updatedAt: z.string().nullable(),
	deletedAt: z.string().nullable(),
	id: z.string(),
	parentId: z.string().nullable(),
	name: z.string(),
	slug: z.string(),
})

export type Category = z.infer<typeof categoriesSchema>
