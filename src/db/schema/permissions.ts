import { relations } from 'drizzle-orm'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { rolePermissions } from './role-permissions'

export const permissions = pgTable('permissions', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),

	key: varchar('key', {
		length: 150,
	})
		.notNull()
		.unique(),

	description: varchar('description', {
		length: 255,
	}),
})

export const permissionsRelations = relations(permissions, ({ many }) => ({
	rolePermissions: many(rolePermissions),
}))
