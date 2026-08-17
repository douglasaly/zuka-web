'use client'
import { useAdminSettings } from '@/modules/admin/hooks/use-admin-settings'
import { ConfirmDialog } from '@/modules/admin/ui/components/confirm-dialog'
import { AdminSettingsAdmins } from '@/modules/admin/ui/sections/admin-settings-admins'
import { AdminSettingsCategories } from '@/modules/admin/ui/sections/admin-settings-categories'
export function SettingsView() {
	const s = useAdminSettings()
	return (
		<div className='max-w-2xl space-y-8'>
			<AdminSettingsCategories
				cats={s.cats}
				catsLoading={s.catsLoading}
				newCatName={s.newCatName}
				onNewCatNameChange={s.setNewCatName}
				editingCat={s.editingCat}
				onEditingChange={s.setEditingCat}
				onRequestDelete={s.setConfirmDeleteCat}
				addCatMutation={s.addCatMutation}
				editCatMutation={s.editCatMutation}
			/>

			<AdminSettingsAdmins
				admins={s.admins}
				adminsLoading={s.adminsLoading}
				removeAdminMutation={s.removeAdminMutation}
			/>

			<ConfirmDialog
				open={Boolean(s.confirmDeleteCat)}
				onOpenChange={(v) => !v && s.setConfirmDeleteCat(null)}
				title='Eliminar categoria'
				description='Os produtos associados a esta categoria poderão ficar sem categoria. Esta ação não pode ser desfeita.'
				confirmLabel='Eliminar'
				loading={s.deleteCatMutation.isPending}
				onConfirm={() =>
					s.confirmDeleteCat &&
					s.deleteCatMutation.mutate(s.confirmDeleteCat)
				}
			/>
		</div>
	)
}
