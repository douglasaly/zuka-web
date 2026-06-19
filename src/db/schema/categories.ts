import { relations } from 'drizzle-orm'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { products } from './products'
import { timestamps } from './timestamps'

export const categories = pgTable('categories', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),

	parentId: uuid('parent_id').references(() => categories.id, {
		onDelete: 'set null',
	}),
	name: varchar('name', {
		length: 150,
	}).notNull(),

	slug: varchar('slug', {
		length: 180,
	})
		.notNull()
		.unique(),

	...timestamps,
})

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
	}),
	children: many(categories),
	products: many(products),
}))
