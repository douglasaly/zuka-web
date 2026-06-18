import { relations } from 'drizzle-orm'
import { pgTable, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { conversationParticipants } from './conversation-participants'
import { messages } from './messages'

export const conversations = pgTable('conversations', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),
})

export const conversationsRelations = relations(conversations, ({ many }) => ({
	participants: many(conversationParticipants),
	messages: many(messages),
}))
