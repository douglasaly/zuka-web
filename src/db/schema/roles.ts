import { relations } from 'drizzle-orm'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { rolePermissions } from './role-permissions'
import { userRoles } from './user-roles'

export const roles = pgTable('roles', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),

	name: varchar('name', {
		length: 100,
	})
		.notNull()
		.unique(),

	description: varchar('description', {
		length: 255,
	}),
})

export const rolesRelations = relations(roles, ({ many }) => ({
	userRoles: many(userRoles),
	rolePermissions: many(rolePermissions),
}))
