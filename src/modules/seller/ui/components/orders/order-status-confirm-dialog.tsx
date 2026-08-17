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
import type { PendingAction } from './types'
import { confirmCopy } from './utils'

type OrderStatusConfirmDialogProps = {
	action: PendingAction | null
	isPending: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: (action: PendingAction) => void
}
export function OrderStatusConfirmDialog({
	action,
	isPending,
	onOpenChange,
	onConfirm,
}: OrderStatusConfirmDialogProps) {
	const confirm = action ? confirmCopy(action) : null
	return (
		<AlertDialog
			open={Boolean(action)}
			onOpenChange={(open) => {
				if (!open && !isPending) onOpenChange(false)
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{confirm?.title}</AlertDialogTitle>
					<AlertDialogDescription>
						{confirm?.description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						disabled={isPending}
						className='rounded-full'
					>
						Voltar
					</AlertDialogCancel>
					<AlertDialogAction
						variant={
							confirm?.destructive ? 'destructive' : 'default'
						}
						className='rounded-full'
						disabled={isPending}
						onClick={(e) => {
							e.preventDefault()
							if (action) onConfirm(action)
						}}
					>
						{isPending ? (
							<>
								<Loader2 className='size-4 animate-spin' />A
								actualizar…
							</>
						) : (
							confirm?.confirmLabel
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
