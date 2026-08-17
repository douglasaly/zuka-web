'use client'
import { useSellerMembers } from '@/modules/seller/hooks/use-seller-members'
import { InviteMemberDialog } from '@/modules/seller/ui/components/members/invite-member-dialog'
import { RemoveMemberDialog } from '@/modules/seller/ui/components/members/remove-member-dialog'
import { useSetSellerPageMeta } from '@/modules/seller/ui/layouts/seller-page-meta'
import {
	SellerMembersError,
	SellerMembersLoading,
} from '@/modules/seller/ui/sections/seller-members-empty'
import { SellerMembersListSection } from '@/modules/seller/ui/sections/seller-members-list-section'
import { SellerMembersToolbar } from '@/modules/seller/ui/sections/seller-members-toolbar'
export const SellerMembersView = () => {
	useSetSellerPageMeta({
		title: 'Membros',
		crumbs: ['Dashboard', 'Loja', 'Membros'],
	})
	const m = useSellerMembers()
	if (m.isLoading) return <SellerMembersLoading />
	if (m.isError) {
		return (
			<SellerMembersError
				forbidden={m.forbidden}
				onRetry={() => m.refetch()}
			/>
		)
	}
	return (
		<div className='w-full min-w-0 space-y-8 pb-10'>
			<SellerMembersToolbar
				canManage={m.canManage}
				memberCount={m.members.length}
				onInvite={m.openInvite}
			/>

			<SellerMembersListSection
				members={m.members}
				owner={m.owner}
				others={m.others}
				canManage={m.canManage}
				currentUserId={m.currentUserId}
				roleCatalog={m.roleCatalog}
				busy={m.busy}
				onInvite={m.openInvite}
				onRoleChange={(memberId, nextRole) =>
					m.roleMutation.mutate({ memberId, nextRole })
				}
				onRemove={m.setRemoving}
			/>

			<InviteMemberDialog
				open={m.inviteOpen}
				canManage={m.canManage}
				email={m.email}
				role={m.role}
				roleCatalog={m.roleCatalog}
				inviteSummary={m.inviteSummary}
				isPending={m.inviteMutation.isPending}
				onOpenChange={m.setInviteOpen}
				onEmailChange={m.setEmail}
				onRoleChange={m.setRole}
				onClose={m.closeInvite}
				onInvite={() => m.inviteMutation.mutate()}
			/>

			<RemoveMemberDialog
				member={m.removing}
				isPending={m.removeMutation.isPending}
				onClose={() => m.setRemoving(null)}
				onConfirm={(memberId) => m.removeMutation.mutate(memberId)}
			/>
		</div>
	)
}
