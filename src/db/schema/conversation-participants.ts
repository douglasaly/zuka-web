import { relations } from 'drizzle-orm'
import { index, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { conversations } from './conversations'
import { users } from './users'

export const conversationParticipants = pgTable(
	'conversation_participants',
	{
		conversationId: uuid('conversation_id')
			.notNull()
			.references(() => conversations.id, {
				onDelete: 'cascade',
			}),

		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
			}),
	},
	(t) => [
		primaryKey({
			columns: [t.conversationId, t.userId],
		}),
		index('idx_conversation_participants_conversation_id').on(
			t.conversationId
		),
	]
)

export const conversationParticipantsRelations = relations(
	conversationParticipants,
	({ one }) => ({
		conversation: one(conversations, {
			fields: [conversationParticipants.conversationId],
			references: [conversations.id],
		}),

		user: one(users, {
			fields: [conversationParticipants.userId],
			references: [users.id],
		}),
	})
)
