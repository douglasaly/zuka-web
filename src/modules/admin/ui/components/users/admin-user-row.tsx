'use client'

import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { hasAdminAccess } from '@/lib/auth/roles'
import type { AdminUserRow } from '@/modules/admin/hooks/use-admin-users'
import { StatusBadge } from '@/modules/admin/ui/components/status-badge'

type AdminUserRowProps = {
	user: AdminUserRow
	onPatch: (id: string, body: Record<string, unknown>) => void
}

export function AdminUserTableRow({ user, onPatch }: AdminUserRowProps) {
	const roles = (user.roles ?? []) as string[]
	const isAdmin = hasAdminAccess(roles)
	const hasAdminRole = roles.includes('admin')

	return (
		<TableRow>
			<TableCell>
				<div className='flex items-center gap-2'>
					{user.avatar_url ? (
						<img
							src={user.avatar_url as string}
							alt=''
							className='size-7 rounded-full object-cover'
						/>
					) : (
						<div className='flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold uppercase'>
							{(user.first_name as string)?.[0] ?? '?'}
						</div>
					)}
					<Link
						href={`/admin/users/${user.id as string}`}
						className='text-sm font-medium hover:underline'
					>
						{`${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() ||
							'—'}
					</Link>
				</div>
			</TableCell>
			<TableCell className='text-sm text-muted-foreground'>
				{(user.email as string) ?? '—'}
			</TableCell>
			<TableCell className='text-sm text-muted-foreground'>
				{(user.phone_number as string) ?? '—'}
			</TableCell>
			<TableCell>
				<div className='flex flex-wrap gap-1'>
					{roles.map((r) => (
						<StatusBadge key={r} status={r} />
					))}
				</div>
			</TableCell>
			<TableCell>
				<StatusBadge status={(user.status as string) ?? 'ACTIVE'} />
			</TableCell>
			<TableCell className='text-xs text-muted-foreground'>
				{user.created_at
					? format(
							new Date(user.created_at as string),
							'd MMM yyyy',
							{
								locale: pt,
							}
						)
					: '—'}
			</TableCell>
			<TableCell>
				<div className='flex gap-1'>
					<Button
						size='sm'
						variant='ghost'
						render={
							<Link href={`/admin/users/${user.id as string}`}>
								Ver
							</Link>
						}
					/>
					{hasAdminRole ? (
						<Button
							size='sm'
							variant='ghost'
							type='button'
							className='text-muted-foreground'
							onClick={() =>
								onPatch(user.id as string, {
									removeAdmin: true,
								})
							}
						>
							Remover admin
						</Button>
					) : !isAdmin ? (
						<Button
							size='sm'
							variant='ghost'
							type='button'
							onClick={() =>
								onPatch(user.id as string, {
									makeAdmin: true,
								})
							}
						>
							Tornar admin
						</Button>
					) : null}
					{user.status !== 'INACTIVE' && (
						<Button
							size='sm'
							variant='ghost'
							type='button'
							className='text-amber-600'
							onClick={() =>
								onPatch(user.id as string, {
									status: 'INACTIVE',
								})
							}
						>
							Desativar
						</Button>
					)}
				</div>
			</TableCell>
		</TableRow>
	)
}
