'use client'

import { Users } from 'lucide-react'
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import type { AdminUserRow } from '@/modules/admin/hooks/use-admin-users'
import { EmptyState } from '@/modules/admin/ui/components/empty-state'
import { TableSkeleton } from '@/modules/admin/ui/components/table-skeleton'
import { AdminUserTableRow } from '@/modules/admin/ui/components/users/admin-user-row'

type AdminUsersListProps = {
	users: AdminUserRow[]
	isLoading: boolean
	onPatch: (id: string, body: Record<string, unknown>) => void
}

export function AdminUsersList({
	users,
	isLoading,
	onPatch,
}: AdminUsersListProps) {
	if (isLoading) {
		return <TableSkeleton rows={8} cols={7} />
	}

	if (users.length === 0) {
		return (
			<EmptyState icon={Users} message='Nenhum utilizador encontrado.' />
		)
	}

	return (
		<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Utilizador</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Telefone</TableHead>
						<TableHead>Funções</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Criado</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<AdminUserTableRow
							key={user.id as string}
							user={user}
							onPatch={onPatch}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
