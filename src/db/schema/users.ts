import { relations } from 'drizzle-orm'
import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { conversationParticipants } from './conversation-participants'
import { messages } from './messages'
import { sellerProfiles } from './seller-profiles'
import { storeFollowers } from './store-followers'
import { timestamps } from './timestamps'
import { userRoles } from './user-roles'

export const users = pgTable('users', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),

	firebaseUid: varchar('firebase_uid', {
		length: 128,
	})
		.notNull()
		.unique(),

	email: varchar('email', {
		length: 255,
	}).unique(),

	firstName: varchar('first_name', {
		length: 100,
	}),

	lastName: varchar('last_name', {
		length: 100,
	}),

	avatarUrl: varchar('avatar_url', {
		length: 500,
	}),

	phoneNumber: varchar('phone_number', {
		length: 30,
	}),

	emailVerified: boolean('email_verified').default(false),

	phoneVerified: boolean('phone_verified').default(false),

	status: varchar('status', {
		length: 30,
	}).default('ACTIVE'),

	...timestamps,
})

export const usersRelations = relations(users, ({ one, many }) => ({
	conversationParticipants: many(conversationParticipants),
	messages: many(messages),
	userRoles: many(userRoles),
	followingStores: many(storeFollowers),
	sellerProfile: one(sellerProfiles, {
		fields: [users.id],
		references: [sellerProfiles.userId],
	}),
}))
