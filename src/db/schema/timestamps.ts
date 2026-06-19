import { timestamp } from 'drizzle-orm/pg-core'

export const timestamps = {
	createdAt: timestamp('created_at', {
		withTimezone: true,
	}).defaultNow(),

	updatedAt: timestamp('updated_at', {
		withTimezone: true,
	})
		.defaultNow()
		.$onUpdate(() => new Date()),

	deletedAt: timestamp('deleted_at', {
		withTimezone: true,
	}),
}
