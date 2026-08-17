'use client'
import { signOut } from 'firebase/auth'
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
export const DangerZone = () => {
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
			router.push('/')
			toast.success('Conta eliminada com sucesso.')
		} catch (err) {
			toast.error(
				err instanceof Error
					? err.message
					: 'Erro ao eliminar conta. Tente novamente.'
			)
		} finally {
			setDeleting(false)
			setOpen(false)
		}
	}
	return (
		<section className='space-y-3'>
			<div>
				<h2 className='text-base font-semibold text-destructive'>
					Zona de perigo
				</h2>
				<p className='text-sm text-muted-foreground'>
					Estas ações são permanentes e não podem ser desfeitas
				</p>
			</div>

			<div className='rounded-xl border border-destructive/30 bg-destructive/5 p-4'>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger
						render={
							<Button variant='destructive' size='sm'>
								Eliminar conta
							</Button>
						}
					/>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Eliminar a sua conta?</DialogTitle>
							<DialogDescription>
								Esta ação é permanente. Todos os seus dados,
								pedidos e itens guardados serão removidos e não
								poderão ser recuperados.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant='outline'
								onClick={() => setOpen(false)}
								disabled={deleting}
							>
								Cancelar
							</Button>
							<Button
								variant='destructive'
								disabled={deleting}
								onClick={handleDelete}
							>
								{deleting ? 'A eliminar...' : 'Sim, eliminar'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</section>
	)
}
