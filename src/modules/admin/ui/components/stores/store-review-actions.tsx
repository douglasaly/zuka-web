'use client'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type StoreReviewActionsProps = {
	showReject: boolean
	rejectionReason: string
	isPending: boolean
	onShowReject: () => void
	onCancelReject: () => void
	onRejectionReasonChange: (value: string) => void
	onApprove: () => void
	onReject: () => void
}
export function StoreReviewActions({
	showReject,
	rejectionReason,
	isPending,
	onShowReject,
	onCancelReject,
	onRejectionReasonChange,
	onApprove,
	onReject,
}: StoreReviewActionsProps) {
	return (
		<div className='shrink-0 border-t border-border/60 px-6 py-4 space-y-3'>
			{showReject ? (
				<div className='space-y-3'>
					<Textarea
						value={rejectionReason}
						onChange={(e) =>
							onRejectionReasonChange(e.target.value)
						}
						placeholder='Motivo de rejeição (obrigatório)...'
						className='min-h-20 resize-none text-sm'
					/>
					<div className='flex gap-2'>
						<Button
							type='button'
							variant='outline'
							className='flex-1'
							onClick={onCancelReject}
						>
							Cancelar
						</Button>
						<Button
							type='button'
							disabled={!rejectionReason.trim() || isPending}
							onClick={onReject}
							className='flex-1 bg-red-600 text-white hover:bg-red-700'
						>
							<XCircle className='size-4' />
							{isPending ? 'A rejeitar...' : 'Rejeitar'}
						</Button>
					</div>
				</div>
			) : (
				<div className='flex gap-2'>
					<Button
						type='button'
						variant='outline'
						className='flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
						onClick={onShowReject}
					>
						<XCircle className='size-4' />
						Rejeitar
					</Button>
					<Button
						type='button'
						disabled={isPending}
						onClick={onApprove}
						className='flex-1 bg-emerald-600 text-white hover:bg-emerald-700'
					>
						<CheckCircle2 className='size-4' />
						{isPending ? 'A aprovar...' : 'Aprovar'}
					</Button>
				</div>
			)}
		</div>
	)
}
