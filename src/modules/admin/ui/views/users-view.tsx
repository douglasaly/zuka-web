'use client'

import { useAdminUsers } from '@/modules/admin/hooks/use-admin-users'
import { ConfirmDialog } from '@/modules/admin/ui/components/confirm-dialog'
import { AdminUsersList } from '@/modules/admin/ui/sections/admin-users-list'
import { AdminUsersToolbar } from '@/modules/admin/ui/sections/admin-users-toolbar'

export function UsersView() {
	const u = useAdminUsers()

	return (
		<div className='space-y-4'>
			<AdminUsersToolbar search={u.search} onSearchChange={u.setSearch} />

			<AdminUsersList
				users={u.users}
				isLoading={u.isLoading}
				onPatch={(id, body) => u.patchMutation.mutate({ id, body })}
			/>

			<ConfirmDialog
				open={Boolean(u.confirmDelete)}
				onOpenChange={(v) => !v && u.setConfirmDelete(null)}
				title='Eliminar utilizador'
				description='Esta ação é irreversível. A conta e todos os dados do utilizador serão eliminados.'
				confirmLabel='Eliminar'
				loading={u.deleteMutation.isPending}
				onConfirm={() =>
					u.confirmDelete && u.deleteMutation.mutate(u.confirmDelete)
				}
			/>
		</div>
	)
}
