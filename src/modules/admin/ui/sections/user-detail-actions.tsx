import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '../components/confirm-dialog'

type UserDetailActionsProps = {
	user: Record<string, unknown>
	hasAdminRole: boolean
	isAdmin: boolean
	confirmAction: 'delete' | 'deactivate' | null
	setConfirmAction: (action: 'delete' | 'deactivate' | null) => void
	patchPending: boolean
	deletePending: boolean
	onPatch: (
		body: Record<string, unknown>,
		opts?: {
			onSuccess?: () => void
		}
	) => void
	onDelete: () => void
}
export function UserDetailActions({
	user,
	hasAdminRole,
	isAdmin,
	confirmAction,
	setConfirmAction,
	patchPending,
	deletePending,
	onPatch,
	onDelete,
}: UserDetailActionsProps) {
	return (
		<>
			<div className='flex flex-wrap gap-2'>
				{hasAdminRole ? (
					<Button
						type='button'
						variant='outline'
						onClick={() => onPatch({ removeAdmin: true })}
						disabled={patchPending}
					>
						Remover função admin
					</Button>
				) : !isAdmin ? (
					<Button
						type='button'
						variant='outline'
						onClick={() => onPatch({ makeAdmin: true })}
						disabled={patchPending}
					>
						Tornar admin
					</Button>
				) : null}
				{user.status !== 'INACTIVE' && (
					<Button
						type='button'
						variant='outline'
						className='border-amber-300 text-amber-700 hover:bg-amber-50'
						onClick={() => setConfirmAction('deactivate')}
					>
						Desativar conta
					</Button>
				)}
			</div>

			<div className='rounded-2xl border border-destructive/20 bg-destructive/5 p-5 space-y-3'>
				<p className='font-heading text-sm font-bold text-destructive'>
					Zona de perigo
				</p>
				<Button
					type='button'
					className='bg-destructive/90 text-white hover:bg-destructive'
					onClick={() => setConfirmAction('delete')}
				>
					Eliminar conta permanentemente
				</Button>
			</div>

			<ConfirmDialog
				open={confirmAction === 'deactivate'}
				onOpenChange={(v) => !v && setConfirmAction(null)}
				title='Desativar conta'
				description='O utilizador não poderá iniciar sessão até a conta ser reativada.'
				confirmLabel='Desativar'
				loading={patchPending}
				onConfirm={() =>
					onPatch(
						{ status: 'INACTIVE' },
						{ onSuccess: () => setConfirmAction(null) }
					)
				}
			/>
			<ConfirmDialog
				open={confirmAction === 'delete'}
				onOpenChange={(v) => !v && setConfirmAction(null)}
				title='Eliminar conta'
				description='Esta ação é irreversível. Todos os dados do utilizador serão eliminados.'
				confirmLabel='Eliminar'
				loading={deletePending}
				onConfirm={onDelete}
			/>
		</>
	)
}
