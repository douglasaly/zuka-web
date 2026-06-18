import { boolean, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { products } from './products'
import { timestamps } from './timestamps'
import { uuidv7 } from 'uuidv7'
import { relations } from 'drizzle-orm'

export const productImages = pgTable('product_images', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),

	productId: uuid('product_id')
		.notNull()
		.references(() => products.id, {
			onDelete: 'cascade',
		}),

	url: text('url').notNull(),

	position: integer('position').default(0),

	isPrimary: boolean('is_primary').default(false),

	alt: text('alt'),

	...timestamps,
})

export const productImagesRelations = relations(productImages, ({ one }) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id],
	}),
}))
