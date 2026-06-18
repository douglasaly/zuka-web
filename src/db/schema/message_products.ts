import { relations } from 'drizzle-orm'
import { index, pgTable, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { messages } from './messages'
import { products } from './products'

export const messageProducts = pgTable(
	'message_products',
	{
		id: uuid('id')
			.primaryKey()
			.$defaultFn(() => uuidv7()),

		messageId: uuid('message_id')
			.notNull()
			.references(() => messages.id, {
				onDelete: 'cascade',
			}),

		productId: uuid('product_id')
			.notNull()
			.references(() => products.id, {
				onDelete: 'cascade',
			}),
	},
	(t) => [
		index('idx_message_products_unique')
			.on(t.messageId, t.productId)
			
	]
)

export const messageProductsRelations = relations(
	messageProducts,
	({ one }) => ({
		message: one(messages, {
			fields: [messageProducts.messageId],
			references: [messages.id],
		}),

		product: one(products, {
			fields: [messageProducts.productId],
			references: [products.id],
		}),
	})
)
