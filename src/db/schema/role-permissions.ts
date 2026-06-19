import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { permissions } from './permissions'
import { roles } from './roles'

export const rolePermissions = pgTable(
	'role_permissions',
	{
		roleId: uuid('role_id')
			.references(() => roles.id, {
				onDelete: 'cascade',
			})
			.notNull(),

		permissionId: uuid('permission_id')
			.references(() => permissions.id, {
				onDelete: 'cascade',
			})
			.notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.roleId, table.permissionId],
		}),
	]
)

export const rolePermissionsRelations = relations(
	rolePermissions,
	({ one }) => ({
		role: one(roles, {
			fields: [rolePermissions.roleId],
			references: [roles.id],
		}),
		permission: one(permissions, {
			fields: [rolePermissions.permissionId],
			references: [permissions.id],
		}),
	})
)
