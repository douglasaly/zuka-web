import { Button } from '@/components/ui/button'

type StoreDetailDangerProps = {
	status: string
	onSuspend: () => void
	onReactivate: () => void
	onDelete: () => void
}
export function StoreDetailDanger({
	status,
	onSuspend,
	onReactivate,
	onDelete,
}: StoreDetailDangerProps) {
	return (
		<div className='rounded-2xl border border-destructive/20 bg-destructive/5 p-5 space-y-3'>
			<p className='font-heading text-sm font-bold text-destructive'>
				Zona de perigo
			</p>
			<div className='flex flex-wrap gap-2'>
				{status !== 'SUSPENDED' && (
					<Button
						type='button'
						variant='outline'
						className='border-amber-300 text-amber-700 hover:bg-amber-50'
						onClick={onSuspend}
					>
						Suspender loja
					</Button>
				)}
				{status === 'SUSPENDED' && (
					<Button
						type='button'
						variant='outline'
						className='border-emerald-300 text-emerald-700 hover:bg-emerald-50'
						onClick={onReactivate}
					>
						Reativar loja
					</Button>
				)}
				<Button
					type='button'
					className='bg-destructive/90 text-white hover:bg-destructive'
					onClick={onDelete}
				>
					Eliminar permanentemente
				</Button>
			</div>
		</div>
	)
}
