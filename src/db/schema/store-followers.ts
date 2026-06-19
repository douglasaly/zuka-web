import { relations } from 'drizzle-orm'
import {
	index,
	pgTable,
	timestamp,
	uniqueIndex,
	uuid,
} from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { stores } from './stores'
import { users } from './users'

export const storeFollowers = pgTable(
	'store_followers',
	{
		id: uuid('id')
			.primaryKey()
			.$defaultFn(() => uuidv7()),

		userId: uuid('user_id')
			.references(() => users.id, {
				onDelete: 'cascade',
			})
			.notNull(),

		storeId: uuid('store_id')
			.references(() => stores.id, {
				onDelete: 'cascade',
			})
			.notNull(),

		followedAt: timestamp('followed_at', {
			withTimezone: true,
		}).defaultNow(),
	},

	(table) => ({
		uniqueFollow: uniqueIndex('unique_user_store_follow').on(
			table.userId,
			table.storeId
		),
		userIndex: index('idx_store_followers_user').on(table.userId),
		storeIndex: index('idx_store_followers_store').on(table.storeId),
	})
)

export const storeFollowersRelations = relations(storeFollowers, ({ one }) => ({
	user: one(users, {
		fields: [storeFollowers.userId],
		references: [users.id],
	}),

	store: one(stores, {
		fields: [storeFollowers.storeId],
		references: [stores.id],
	}),
}))
