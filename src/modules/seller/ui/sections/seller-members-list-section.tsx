'use client'

import { MemberRow } from '@/modules/seller/ui/components/members/member-row'
import type {
	Member,
	RoleCatalog,
} from '@/modules/seller/ui/components/members/types'
import { SellerMembersEmpty } from '@/modules/seller/ui/sections/seller-members-empty'

type SellerMembersListSectionProps = {
	members: Member[]
	owner: Member | undefined
	others: Member[]
	canManage: boolean
	currentUserId: string | null
	roleCatalog: RoleCatalog
	busy: boolean
	onInvite: () => void
	onRoleChange: (memberId: string, nextRole: string) => void
	onRemove: (member: Member) => void
}

export function SellerMembersListSection({
	members,
	owner,
	others,
	canManage,
	currentUserId,
	roleCatalog,
	busy,
	onInvite,
	onRoleChange,
	onRemove,
}: SellerMembersListSectionProps) {
	return (
		<>
			{owner ? (
				<section aria-labelledby='owner-heading' className='space-y-3'>
					<h2
						id='owner-heading'
						className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'
					>
						Dono
					</h2>
					<MemberRow
						member={owner}
						isSelf={
							Boolean(currentUserId) &&
							owner.user.id === currentUserId
						}
						emphasized
					/>
				</section>
			) : null}

			{others.length > 0 ? (
				<section aria-labelledby='team-heading' className='space-y-3'>
					<div className='flex items-baseline justify-between gap-3'>
						<h2
							id='team-heading'
							className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'
						>
							Equipe
						</h2>
						<span className='text-xs text-muted-foreground tabular-nums'>
							{others.length}
						</span>
					</div>
					{/* biome-ignore lint/a11y/useSemanticElements: explicit list role retained from prior markup */}
					{/* biome-ignore lint/a11y/noRedundantRoles: explicit list role retained from prior markup */}
					<ul className='space-y-2' role='list'>
						{others.map((member) => (
							<li key={member.id}>
								<MemberRow
									member={member}
									isSelf={
										Boolean(currentUserId) &&
										member.user.id === currentUserId
									}
									canManage={canManage}
									roleCatalog={roleCatalog}
									busy={busy}
									onRoleChange={(nextRole) =>
										onRoleChange(member.id, nextRole)
									}
									onRemove={() => onRemove(member)}
								/>
							</li>
						))}
					</ul>
				</section>
			) : null}

			{members.length === 0 ? (
				<SellerMembersEmpty canManage={canManage} onInvite={onInvite} />
			) : null}

			{owner && others.length === 0 && canManage ? (
				<p className='rounded-2xl border border-dashed border-border/70 bg-muted/15 px-4 py-3 text-sm text-muted-foreground'>
					Ainda és só tu. Convida um colaborador quando precisares de
					ajuda no dia a dia.
				</p>
			) : null}
		</>
	)
}
