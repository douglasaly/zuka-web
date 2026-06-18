import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { conversations } from './conversations'
import { messageProducts } from './message_products'
import { users } from './users'

export const messages = pgTable('messages', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),

	conversationId: uuid('conversation_id')
		.notNull()
		.references(() => conversations.id, {
			onDelete: 'cascade',
		}),

	senderId: uuid('sender_id')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade',
		}),

	content: text('content').notNull(),
})

export const messagesRelations = relations(messages, ({ one, many }) => ({
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id],
	}),

	sender: one(users, {
		fields: [messages.senderId],
		references: [users.id],
	}),

	products: many(messageProducts),
}))
