'use client'
import { Crown, MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { STORE_ROLE_UI } from '@/lib/auth/store-permissions'
import { cn } from '@/lib/utils'
import { ROLE_LABELS } from '@/modules/seller/ui/components/members/constants'
import type {
	InviteRole,
	Member,
	RoleCatalog,
} from '@/modules/seller/ui/components/members/types'
import {
	displayName,
	formatJoined,
	initialsOf,
} from '@/modules/seller/ui/components/members/utils'

type MemberRowProps = {
	member: Member
	isSelf?: boolean
	emphasized?: boolean
	canManage?: boolean
	roleCatalog?: RoleCatalog
	busy?: boolean
	onRemove?: () => void
	onRoleChange?: (role: string) => void
}
export function MemberRow({
	member,
	isSelf,
	emphasized,
	canManage,
	roleCatalog,
	busy,
	onRemove,
	onRoleChange,
}: MemberRowProps) {
	const isOwner = member.role === 'owner'
	const fullName = displayName(member.user)
	const initials = initialsOf(member.user)
	const roleLabel = ROLE_LABELS[member.role] ?? member.role
	return (
		<article
			className={cn(
				'flex flex-col gap-3 rounded-2xl border bg-card p-4 transition-colors sm:flex-row sm:items-center sm:gap-4',
				emphasized
					? 'border-amber-500/25 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
					: 'border-border/60',
				isSelf && !emphasized && 'bg-muted/25'
			)}
		>
			<div className='flex min-w-0 flex-1 items-center gap-3'>
				<Avatar size='lg' className='size-11'>
					{member.user.avatarUrl ? (
						<AvatarImage
							src={member.user.avatarUrl}
							alt={`Foto de ${fullName}`}
						/>
					) : null}
					<AvatarFallback className='text-xs font-medium'>
						{initials}
					</AvatarFallback>
				</Avatar>

				<div className='min-w-0 flex-1'>
					<p className='truncate font-medium'>{fullName}</p>
					{member.user.email ? (
						<p className='truncate text-xs text-muted-foreground'>
							{member.user.email}
						</p>
					) : null}
					<p className='mt-0.5 text-xs text-muted-foreground'>
						{formatJoined(member.joinedAt)}
					</p>
				</div>
			</div>

			<div className='flex flex-wrap items-center gap-2 sm:justify-end'>
				{isOwner ? (
					<Badge
						variant='outline'
						className='h-7 gap-1.5 border-amber-500/30 bg-amber-500/10 px-2.5 text-amber-800 dark:text-amber-300'
					>
						<Crown
							className='size-3.5 text-amber-500'
							aria-hidden
						/>
						{isSelf ? 'Você' : 'Dono'}
					</Badge>
				) : isSelf ? (
					<Badge variant='secondary' className='h-7 px-2.5'>
						Você
					</Badge>
				) : !canManage ? (
					<Badge variant='secondary' className='h-7 px-2.5'>
						{roleLabel}
					</Badge>
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant='outline'
									size='sm'
									className='h-9 gap-1.5 rounded-full'
									disabled={busy}
									aria-label={`Gerir ${fullName}`}
								/>
							}
						>
							{roleLabel}
							<MoreHorizontal className='size-4 opacity-60' />
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-52'>
							<DropdownMenuRadioGroup
								value={member.role}
								onValueChange={(v) => {
									if (v && v !== member.role) {
										onRoleChange?.(v)
									}
								}}
							>
								<DropdownMenuLabel>Função</DropdownMenuLabel>
								{(
									Object.keys(
										roleCatalog ?? STORE_ROLE_UI
									) as InviteRole[]
								).map((key) => (
									<DropdownMenuRadioItem
										key={key}
										value={key}
										disabled={busy}
									>
										{
											(roleCatalog ?? STORE_ROLE_UI)[key]
												.label
										}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant='destructive'
								disabled={busy}
								onClick={() => onRemove?.()}
							>
								Remover da Equipe
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</article>
	)
}
