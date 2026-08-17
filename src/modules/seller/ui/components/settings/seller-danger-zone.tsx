'use client'
import { signOut } from 'firebase/auth'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { auth } from '@/lib/firebase/firebase-client'
export function SellerDangerZone() {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [deleting, setDeleting] = useState(false)
	async function handleDelete() {
		setDeleting(true)
		try {
			const res = await fetch('/api/auth/delete-account', {
				method: 'POST',
				credentials: 'include',
			})
			if (!res.ok) {
				const body = await res.json().catch(() => ({}))
				throw new Error(body.error || 'Erro ao eliminar conta')
			}
			await signOut(auth)
			setOpen(false)
			toast.success('Conta eliminada')
			router.push('/')
		} catch (err) {
			toast.error(
				err instanceof Error
					? err.message
					: 'Erro ao eliminar conta. Tente novamente.'
			)
		} finally {
			setDeleting(false)
		}
	}
	return (
		<section className='min-w-0 space-y-3'>
			<div className='min-w-0 px-0.5'>
				<h2 className='font-heading text-base font-semibold tracking-tight text-destructive'>
					Zona de perigo
				</h2>
				<p className='mt-1 text-sm text-muted-foreground'>
					Acções permanentes, confirme com cuidado.
				</p>
			</div>

			<div className='flex min-w-0 flex-col gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5'>
				<div className='min-w-0'>
					<p className='text-sm font-medium'>Eliminar conta e loja</p>
					<p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
						Remove a conta, a loja e os dados associados. Não é
						possível reverter.
					</p>
				</div>
				<Dialog
					open={open}
					onOpenChange={(next) => {
						if (deleting) return
						setOpen(next)
					}}
				>
					<DialogTrigger
						render={
							<Button
								variant='destructive'
								size='sm'
								className='shrink-0 rounded-full'
							>
								Eliminar conta
							</Button>
						}
					/>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Eliminar conta e loja?</DialogTitle>
							<DialogDescription>
								Esta acção é permanente. A loja deixa de estar
								visível no marketplace e os dados da conta são
								removidos.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant='outline'
								className='rounded-full'
								onClick={() => setOpen(false)}
								disabled={deleting}
							>
								Cancelar
							</Button>
							<Button
								variant='destructive'
								className='rounded-full'
								disabled={deleting}
								onClick={handleDelete}
							>
								{deleting ? (
									<>
										<Loader2 className='size-4 animate-spin' />
										A eliminar…
									</>
								) : (
									'Sim, eliminar tudo'
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</section>
	)
}
