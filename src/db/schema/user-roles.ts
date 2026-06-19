import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { roles } from './roles'
import { users } from './users'

export const userRoles = pgTable(
	'user_roles',
	{
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
			}),

		roleId: uuid('role_id')
			.notNull()
			.references(() => roles.id, {
				onDelete: 'cascade',
			}),
	},
	(table) => [
		primaryKey({
			columns: [table.userId, table.roleId],
		}),
	]
)

export const userRolesRelations = relations(userRoles, ({ one }) => ({
	user: one(users, {
		fields: [userRoles.userId],
		references: [users.id],
	}),
	role: one(roles, {
		fields: [userRoles.roleId],
		references: [roles.id],
	}),
}))
