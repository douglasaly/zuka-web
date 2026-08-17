'use client'
import { useUserDetail } from '@/modules/admin/hooks/use-user-detail'
import { UserDetailActions } from '../sections/user-detail-actions'
import { UserDetailCards } from '../sections/user-detail-cards'
import {
	UserDetailLoading,
	UserDetailNotFound,
} from '../sections/user-detail-gates'
import { UserDetailHeader } from '../sections/user-detail-profile'
export function UserDetailView({ id }: { id: string }) {
	const d = useUserDetail(id)
	if (d.isLoading) {
		return <UserDetailLoading />
	}
	if (!d.user) {
		return <UserDetailNotFound />
	}
	return (
		<div className='max-w-2xl space-y-6'>
			<UserDetailHeader user={d.user} />

			<UserDetailCards user={d.user} store={d.store} roles={d.roles} />

			<UserDetailActions
				user={d.user}
				hasAdminRole={d.hasAdminRole}
				isAdmin={d.isAdmin}
				confirmAction={d.confirmAction}
				setConfirmAction={d.setConfirmAction}
				patchPending={d.patchMutation.isPending}
				deletePending={d.deleteMutation.isPending}
				onPatch={(body, opts) => d.patchMutation.mutate(body, opts)}
				onDelete={() => d.deleteMutation.mutate()}
			/>
		</div>
	)
}
