import { relations, sql } from 'drizzle-orm'
import {
	boolean,
	integer,
	pgTable,
	text,
	uniqueIndex,
	uuid,
} from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { products } from './products'
import { timestamps } from './timestamps'

export const productImages = pgTable(
	'product_images',
	{
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
	},
	(t) => [
		uniqueIndex('idx_product_primary_image')
			.on(t.productId, t.isPrimary)
			.where(sql`${t.isPrimary} = true`),
	]
)

export const productImagesRelations = relations(productImages, ({ one }) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id],
	}),
}))
