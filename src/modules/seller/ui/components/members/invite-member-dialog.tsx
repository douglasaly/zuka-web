'use client'

import { Loader2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { INVITE_ROLES } from '@/modules/seller/ui/components/members/constants'
import type {
	InviteRole,
	RoleCatalog,
} from '@/modules/seller/ui/components/members/types'

type InviteMemberDialogProps = {
	open: boolean
	canManage: boolean
	email: string
	role: InviteRole
	roleCatalog: RoleCatalog
	inviteSummary: string | undefined
	isPending: boolean
	onOpenChange: (open: boolean) => void
	onEmailChange: (email: string) => void
	onRoleChange: (role: InviteRole) => void
	onClose: () => void
	onInvite: () => void
}

export function InviteMemberDialog({
	open,
	canManage,
	email,
	role,
	roleCatalog,
	inviteSummary,
	isPending,
	onOpenChange,
	onEmailChange,
	onRoleChange,
	onClose,
	onInvite,
}: InviteMemberDialogProps) {
	return (
		<Dialog
			open={open && canManage}
			onOpenChange={(nextOpen) => {
				if (!nextOpen && !isPending) onClose()
				else if (nextOpen) onOpenChange(true)
			}}
		>
			<DialogContent className='rounded-2xl sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='font-heading text-lg font-bold'>
						Convidar membro
					</DialogTitle>
					<DialogDescription>
						A pessoa precisa de já ter uma conta no Zuka com o mesmo
						email.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='invite-email'>Email</Label>
						<Input
							id='invite-email'
							type='email'
							autoComplete='email'
							inputMode='email'
							placeholder='ex.: ana@exemplo.com'
							value={email}
							onChange={(e) => onEmailChange(e.target.value)}
							onKeyDown={(e) => {
								if (
									e.key === 'Enter' &&
									email.trim() &&
									!isPending
								) {
									onInvite()
								}
							}}
							className='h-11 rounded-full'
							disabled={isPending}
							autoFocus
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='invite-role'>Função</Label>
						<Select
							value={role}
							onValueChange={(v) => {
								if (
									v &&
									INVITE_ROLES.includes(v as InviteRole)
								) {
									onRoleChange(v as InviteRole)
								}
							}}
							disabled={isPending}
						>
							<SelectTrigger
								id='invite-role'
								className='h-11 rounded-full'
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{INVITE_ROLES.map((key) => (
									<SelectItem key={key} value={key}>
										{roleCatalog[key].label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{inviteSummary ? (
							<p className='text-xs leading-relaxed text-muted-foreground'>
								{inviteSummary}
							</p>
						) : null}
					</div>
				</div>

				<DialogFooter className='gap-2'>
					<Button
						variant='outline'
						className='rounded-full'
						onClick={onClose}
						disabled={isPending}
					>
						Cancelar
					</Button>
					<Button
						className='rounded-full'
						onClick={onInvite}
						disabled={!email.trim() || isPending}
					>
						{isPending ? (
							<>
								<Loader2 className='size-4 animate-spin' />A
								convidar…
							</>
						) : (
							<>
								<UserPlus className='size-4' />
								Convidar
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
