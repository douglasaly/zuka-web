'use client'
import { Loader2 } from 'lucide-react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Member } from '@/modules/seller/ui/components/members/types'
import { displayName } from '@/modules/seller/ui/components/members/utils'

type RemoveMemberDialogProps = {
	member: Member | null
	isPending: boolean
	onClose: () => void
	onConfirm: (memberId: string) => void
}
export function RemoveMemberDialog({
	member,
	isPending,
	onClose,
	onConfirm,
}: RemoveMemberDialogProps) {
	return (
		<AlertDialog
			open={Boolean(member)}
			onOpenChange={(open) => {
				if (!open && !isPending) onClose()
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Remover {member ? displayName(member.user) : 'membro'}?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Essa pessoa deixa de aceder ao painel desta loja. Podes
						convidá-la outra vez mais tarde.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						disabled={isPending}
						className='rounded-full'
					>
						Cancelar
					</AlertDialogCancel>
					<AlertDialogAction
						variant='destructive'
						className='rounded-full'
						disabled={isPending}
						onClick={(e) => {
							e.preventDefault()
							if (member) {
								onConfirm(member.id)
							}
						}}
					>
						{isPending ? (
							<>
								<Loader2 className='size-4 animate-spin' />A
								remover…
							</>
						) : (
							'Remover da Equipe'
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
