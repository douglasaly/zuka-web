'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminAccountRow } from '@/modules/admin/ui/components/settings/admin-account-row'

type AdminSettingsAdminsProps = {
	admins: Record<string, unknown>[]
	adminsLoading: boolean
	removeAdminMutation: UseMutationResult<void, Error, string, unknown>
}

export function AdminSettingsAdmins({
	admins,
	adminsLoading,
	removeAdminMutation,
}: AdminSettingsAdminsProps) {
	return (
		<section className='space-y-3'>
			<div>
				<p className='font-heading font-bold'>Contas admin</p>
				<p className='text-sm text-muted-foreground'>
					Utilizadores com acesso ao painel de administração
				</p>
			</div>

			{adminsLoading ? (
				<div className='space-y-2'>
					{Array.from({ length: 2 }, (_, i) => (
						<Skeleton key={i} className='h-12 rounded-xl' />
					))}
				</div>
			) : (
				<div className='rounded-2xl border border-border/60 bg-card overflow-hidden divide-y divide-border/40'>
					{admins.length === 0 && (
						<p className='py-8 text-center text-sm text-muted-foreground'>
							Sem admins.
						</p>
					)}
					{admins.map((user) => (
						<AdminAccountRow
							key={user.id as string}
							user={user}
							removePending={removeAdminMutation.isPending}
							onRemove={(id) => removeAdminMutation.mutate(id)}
						/>
					))}
				</div>
			)}
		</section>
	)
}
